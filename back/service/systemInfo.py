import psutil
from decimal import Decimal, ROUND_HALF_UP
import  numpy as np


def get_cpu_info():
    # 获取CPU使用率
    cpu_usage = np.round(psutil.cpu_percent(interval=1),2)
    # 物理核心数和逻辑核心数
    cpu_count_logical = psutil.cpu_count(logical=True)

    return {
        'cpuCore':cpu_count_logical,
        'cpu_percent':cpu_usage,
    }


def get_memory_info():
    # 获取虚拟内存的信息
    memory_info = psutil.virtual_memory()
    total_memory = np.round(memory_info.total / (1024 ** 3),0)   # 转换为GB
    memory_percent = np.round(memory_info.percent,2)

    return {
        'memory':total_memory,
        'memory_percent':memory_percent,
    }


def get_disk_info():
    total_space = 0
    used_space = 0
    free_space = 0

    # 获取所有磁盘分区的信息
    partitions = psutil.disk_partitions()
    for partition in partitions:
        try:
            usage = psutil.disk_usage(partition.mountpoint)
            total_space += usage.total
            used_space += usage.used
            free_space += usage.free
        except PermissionError:
            # 忽略无法访问的分区
            continue

    # 将字节转换为GB
    total_space_gb = np.round( total_space / (1024 ** 3),0)
    percent_used = np.round((used_space / total_space) * 100 if total_space > 0 else 0,2)

    return {
        'total_space_gb':total_space_gb,
        'disk_percent':percent_used,
    }

def systemInfo():
    system_info = []

    cup_info = get_cpu_info()
    system_info.append(cup_info)

    memory_info = get_memory_info()
    system_info.append(memory_info)

    disk_info = get_disk_info()
    system_info.append(disk_info)

    return  system_info

if __name__ == "__main__":

    systemInfo = systemInfo()
    print(systemInfo)

