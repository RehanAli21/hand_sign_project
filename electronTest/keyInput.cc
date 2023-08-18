#include <node_api.h>
#include <stdio.h>
#include <windows.h>

napi_value PressW(napi_env env, napi_callback_info info)
{
    INPUT in[1] = {};
    ZeroMemory(in, sizeof(in));

    in[0].type = INPUT_KEYBOARD;
    in[0].ki.wVk = 'W';
    in[0].ki.dwFlags = KEYEVENTF_EXTENDEDKEY;

    in[1].type = INPUT_KEYBOARD;
    in[1].ki.wVk = 'W';
    in[1].ki.dwFlags = KEYEVENTF_KEYUP;
    UINT uS = SendInput(2, in, sizeof(INPUT));

    if (uS != 2)
    {
        printf("error " + uS);
    }
    else
    {
        printf("pressed");
    }

    return NULL;
}
napi_value PressS(napi_env env, napi_callback_info info)
{
    INPUT in[1] = {};
    ZeroMemory(in, sizeof(in));

    in[0].type = INPUT_KEYBOARD;
    in[0].ki.wVk = 'S';
    in[0].ki.dwFlags = KEYEVENTF_EXTENDEDKEY;

    in[1].type = INPUT_KEYBOARD;
    in[1].ki.wVk = 'S';
    in[1].ki.dwFlags = KEYEVENTF_KEYUP;
    UINT uS = SendInput(2, in, sizeof(INPUT));

    if (uS != 2)
    {
        printf("error " + uS);
    }
    else
    {
        printf("pressed");
    }

    return NULL;
}
napi_value PressA(napi_env env, napi_callback_info info)
{
    INPUT in[1] = {};
    ZeroMemory(in, sizeof(in));

    in[0].type = INPUT_KEYBOARD;
    in[0].ki.wVk = 'A';
    in[0].ki.dwFlags = KEYEVENTF_EXTENDEDKEY;

    in[1].type = INPUT_KEYBOARD;
    in[1].ki.wVk = 'A';
    in[1].ki.dwFlags = KEYEVENTF_KEYUP;
    UINT uS = SendInput(2, in, sizeof(INPUT));

    if (uS != 2)
    {
        printf("error " + uS);
    }
    else
    {
        printf("pressed");
    }

    return NULL;
}
napi_value PressD(napi_env env, napi_callback_info info)
{
    INPUT in[1] = {};
    ZeroMemory(in, sizeof(in));

    in[0].type = INPUT_KEYBOARD;
    in[0].ki.wVk = 'D';
    in[0].ki.dwFlags = KEYEVENTF_EXTENDEDKEY;

    in[1].type = INPUT_KEYBOARD;
    in[1].ki.wVk = 'D';
    in[1].ki.dwFlags = KEYEVENTF_KEYUP;
    UINT uS = SendInput(2, in, sizeof(INPUT));

    if (uS != 2)
    {
        printf("error " + uS);
    }
    else
    {
        printf("pressed");
    }

    return NULL;
}

napi_value init(napi_env env, napi_value exports)
{

    napi_status status2;

    napi_value fn2;
    status2 = napi_create_function(env, NULL, 0, PressW, NULL, &fn2);
    if (status2 != napi_ok)
        return NULL;

    status2 = napi_set_named_property(env, exports, "pressW", fn2);
    if (status2 != napi_ok)
        return NULL;

    napi_status status3;

    napi_value fn3;
    status3 = napi_create_function(env, NULL, 0, PressS, NULL, &fn3);
    if (status3 != napi_ok)
        return NULL;

    status3 = napi_set_named_property(env, exports, "pressS", fn3);
    if (status3 != napi_ok)
        return NULL;

    napi_status status4;

    napi_value fn4;
    status4 = napi_create_function(env, NULL, 0, PressA, NULL, &fn4);
    if (status4 != napi_ok)
        return NULL;

    status4 = napi_set_named_property(env, exports, "pressA", fn4);
    if (status4 != napi_ok)
        return NULL;

    napi_status status5;

    napi_value fn5;
    status5 = napi_create_function(env, NULL, 0, PressD, NULL, &fn5);
    if (status5 != napi_ok)
        return NULL;

    status5 = napi_set_named_property(env, exports, "pressD", fn5);
    if (status5 != napi_ok)
        return NULL;

    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init);
