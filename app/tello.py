import socket
import threading
from time import time, sleep

from handle import Handler

TIMEOUT = 10


class Tello:
    """Handles the communication between the client and the tello."""
    host = ''
    tello_ip = '192.168.10.1'
    cmd_port = 8889
    cmd_address = (tello_ip, cmd_port)

    def __init__(self):
        # create command socket and bind it to cmd_port
        self.cmd_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.cmd_socket.bind((self.host, self.cmd_port))

        # start the receiving command thread
        self.receive_cmd_thread = threading.Thread(
            target=self._receive_cmd_thread)
        self.receive_cmd_thread.start()

        # response waiting flag
        self.waiting = False

        # initialize the logger object
        self.handler = Handler()

        # indicates whether a command was executed successfully
        self.command_success = False

        self.initialized = self.initialize()

    def __del__(self):
        """On delete, closes the running sockets."""
        self.cmd_socket.close()

    def send_command(self, command, reverse=False):
        """Sends the given command to tello and waits in a loop for the response.

        The loop is exited if the waiting flag is set to False or the timeout
        window has expired.

        Args:
            command (string): The command to be sent
            reverse (bool): If the command belongs to reverse pathing commands
        Returns:
            bool: True if the command sent successfully and the response was
            "OK". False if the command could not be sent or the response was
            "ERROR".
        """
        if self.waiting:
            # if the server is waiting for a reponse, no further command
            # can be accepted and sent
            print('[ERROR] Another command awaits reponse, please wait')
            return False

        if command != 'command' and not self.initialized:
            # if tello is not initialized it cannot accept any commands
            print('[ERROR]: Tello must be initialized. Run "command" first.')
            return False

        if not reverse:
            # if the command is part of fetching, dont print it
            print('[INFO]  Sending: {}'.format(command))
        # waiting flag is set to True
        self.waiting = True
        self.handler.set_command_sent(command)
        # send the command encoded to utf-8
        self.cmd_socket.sendto(command.encode('utf-8'), self.cmd_address)

        start = time()
        while self.waiting:
            # when the response arrives, self.waiting is set to False
            sleep(0.005)  # limit to 200 checks per second
            if time() - start > TIMEOUT:
                # when the waiting period exceeds the timeout limit print the
                # error and set the waiting flag to False, so that the server
                # can accept a new command
                print('[ERROR] Command {} timed out.'.format(command))
                self.handler.reset()
                self.waiting = False
                return False
        else:
            # executed when while is terminated by the self.waiting command and
            # not the break
            return self.command_success

    def _receive_cmd_thread(self):
        """Listens for a response from the cmd_socket.

        When the response arrives, calls handler.received which sets the
        command_success attribute and sets the waiting flag to False.
        """
        while True:
            try:
                response, ip = self.cmd_socket.recvfrom(1024)
                try:
                    print('[INFO]  Response: {}'.format(
                        response.decode('UTF-8')))
                except UnicodeDecodeError:
                    print('[INFO]  Response: {}'.format(
                        response.decode('latin-1')))

                if response == 'Error':
                    # command not executed
                    self.command_success = False
                    self.handler.reset()
                else:
                    self.command_success = self.handler.received(response)
                self.waiting = False
            except socket.error as e:
                print('[ERROR] {}'.format(e))

    def fetch(self):
        """Retrieves the reversed pathing commands and sends them to tello."""
        print('[INFO] Returning home...')
        r_cmds = self.handler.reverse_path_cmd()
        for cmd in r_cmds:
            # TODO: what if command fails
            self.send_command(cmd, reverse=True)

    def initialize(self):
        """Sends "command" command.

        Returns:
            bool: True if "command" was sent successfully, False if "command" failed
        """
        return self.send_command('command')

    def execute(self, steps):
        """Executes the steps received from frontend after taking off and in the end
        executes the 'land' command.

        Args:
            steps (list): Steps that user drew in canvas
        """
        if self.initialized:
            self.send_command('takeoff')

            # calculate the 'go' commmands that correspond to each step
            go_cmds = self.handler.cacl_go_cmd(steps)

            for go_cmd in go_cmds:
                self.send_command(go_cmd)

            self.send_command('land')
        else:
            print('[ERROR] Initialization failed.')
