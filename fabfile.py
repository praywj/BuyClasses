import getpass
from fabric import Connection, Config
from invoke import task

HOST_CONF = {
    'test': ('2088d869l3.51mypc.cn', 'pi', 45730),
    'web_online': ('106.75.29.134', 'web_user', 22)
}

@task
def deploy(c, server='test'):
    if server not in HOST_CONF.keys():
        return
    password = getpass.getpass("What's your ssh password?")
    config = Config(overrides={'connect_kwargs': {'password': password}, 'run': {'echo': True}})
    host_conf = HOST_CONF[server]
    remote_path = '/home/{user}/'.format(user=host_conf[1])
    my_c = Connection(host=host_conf[0], user=host_conf[1], port=host_conf[2], config=config)
    # 部署前端代码
    front_code_dir = remote_path + 'workspace/craftsman_front/'
    back_code_dir = remote_path + 'workspace/craftsman_back/'
    from_templates_path = front_code_dir + 'templates/'
    dest_templates_path = back_code_dir + 'templates/'
    from_static = front_code_dir + 'static/'
    dest_static = back_code_dir + 'static/'
    with my_c.cd(front_code_dir):
            my_c.run("git reset --hard")
            my_c.run("git pull origin test" if server == 'test' else "git pull")
            my_c.run("rsync -r {from_temp} {dest_temp}".format(from_temp=from_templates_path,
                                                               dest_temp=dest_templates_path))
            my_c.run("rsync -r {from_static} {dest_static}".format(from_static=from_static,
                                                                   dest_static=dest_static))