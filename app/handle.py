from time import time
from datetime import datetime
from collections import namedtuple

from utils import reverse_cmd_map

cmdPoint = namedtuple('cmdPoint', ['command', 'sTime', 'rTime'])


class Handler:
    """Handles the logs of a tello session.

    Attributes:
        starting_time: The starting datetime of the session
        start_stamp: Starting timestamp
        command_sent: A list tuple containing the body and the time of the
            command sent to tello
        command_tuples: A list of cmdPoint tuples
        battery: The battery level of tello
        status: The status of tello
    """

    def __init__(self):
        self.starting_time = datetime.now().strftime('%A %d. %B, %H:%M')
        self.start_stamp = time()

        self.command_sent = ()  # tuple with the command sent and its timestamp
        self.command_tuples = []  # list of cmdPoints

    def set_command_sent(self, command):
        self.command_sent = (command, time() - self.start_stamp)

    def reset(self):
        """Sets the command_sent attribute to an empty tuple."""
        self.command_sent = ()

    def received(self, response):
        """Handles tello's response.

        Updates the command_tuples list and the status.

        Args:
            response (string): The body of the response
        Returns:
            bool: True if execution was successful, False if a command was not sent
        """
        rsp_time = time() - self.start_stamp

        try:
            # form the cmdPoint tuple
            cmd_tuple = cmdPoint(command=self.command_sent[0],
                                 sTime=self.command_sent[1],
                                 rTime=rsp_time)
            self.command_tuples.append(cmd_tuple)
        except IndexError:
            # IndexError: command_sent is an empty tuple
            return False

        return True

    def get_pathing_commands(self):
        """Forms a list of the grouped pathing commands.

        Pathing commands have the following format: {direction} {value}
        Same commands are grouped, that means that they are represented
        as {direction} {sum_value}.

        Returns:
            List of strings: The grouped command strings.
        """
        pathing_command_list = [
            'up', 'down', 'left', 'right', 'forward', 'back', 'cw', 'ccw'
        ]
        filtered_commands = list(
            filter(lambda x: x.command.split(' ')[0] in pathing_command_list,
                   self.command_tuples))

        last_cmd = None
        sum_value = 0  # value of consecutive same commands
        grouped = []
        for ind, cmd in enumerate(filtered_commands):
            direction, value = cmd.command.split(' ')
            value = int(value)

            if not ind:
                # if first command, just set last command to current
                # and increase the sum_value
                last_cmd = direction
                sum_value += value
                continue

            if last_cmd == direction:
                # if same command just increase the sum_value
                sum_value += value
            else:
                # if commands diviate, append to grouped the last command
                # with the sum_value
                grouped.append('{} {}'.format(last_cmd, sum_value))
                last_cmd = direction
                # sum_value must be set to current value and not 0!
                sum_value = value

            if ind == len(filtered_commands) - 1:
                # if the last command, add it to grouped along with the
                # sum value
                grouped.append('{} {}'.format(direction, sum_value))
        return grouped

    def reverse_path_cmd(self):
        """Iterates through the grouped pathing commands and returns their
        reveresed.

        The reverse of a command is defined by the reverse_cmd_map dictionary.

        Returns:
            List of strings: The reversed pathing commands
        """
        # path_cmd is a list of cmdPoints
        path_cmd = self.get_pathing_commands()

        reversed_path_cmd = []
        for cmd in reversed(path_cmd):
            direction, value = cmd.split(' ')
            try:
                reversed_dir = reverse_cmd_map[direction]
                reversed_cmd = '{} {}'.format(reversed_dir, value)
                reversed_path_cmd.append(reversed_cmd)
            except KeyError:
                # direction not found in reverse_cmd_map
                print('Invalid direction')
        return reversed_path_cmd

    def to_text(self, txt_name):
        """Generates a txt file with the commands of the current session.

        Args:
            txt_name (string): The name of the generated file
        """
        if self.starting_time is None:
            print('[INFO] Empty session.')
            return
        with open(txt_name, 'w') as f:
            f.write(self.starting_time + '\n')
            for cmd in self.command_tuples:
                f.write('\n{cmd.command}\t {cmd.sTime} {cmd.rTime}'.format(
                    cmd=cmd))

    def cacl_go_cmd(self, steps):
        """Converts movement commands to go commands.

        Args:
            steps (list): List of movement commands
        Returns:
            list: The go commands
        """
        go_cmds = []
        speed = 10

        for step in steps:
            x = 0
            y = 0
            z = 0

            try:
                direction, distance = step.split(' ')
                distance = int(distance)
            except ValueError:
                # ValueError: step invalid format or distance is not a valid integer
                continue

            if direction == 'forward':
                y += distance
            elif direction == 'back':
                y -= distance
            elif direction == 'left':
                x -= distance
            elif direction == 'right':
                x += distance
            elif direction == 'up':
                z += distance
            elif direction == 'down':
                z += distance
            else:
                print('unknown direction')

            go_cmd = 'go {} {} {} {}'.format(x, y, z, speed)
            go_cmds.append(go_cmd)

        return go_cmds
