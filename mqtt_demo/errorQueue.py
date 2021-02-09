ERROR_MSG_QUEUE = []


def queueErrMsg(errStr):
    if isinstance(errStr, str):
        ERROR_MSG_QUEUE.append(errStr)


def popErrMsg():
    if ERROR_MSG_QUEUE:
        return ERROR_MSG_QUEUE.pop()
    else:
        return None
