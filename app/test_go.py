from tello import Tello

tello = Tello()

tello.send_command('takeoff')

while True:
    try:
        x, y, z, *_ = input('Enter x y z: ').split(' ')
        x = int(x)
        y = int(y)
        z = int(z)

        go_cmd = 'go {} {} {} 10'.format(x, y, z)

        tello.send_command(go_cmd)
    except ValueError:
        # ValueError: Not enough values given or a given number is not a
        # valid string
        print("Try again")
