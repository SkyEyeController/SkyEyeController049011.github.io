---
title: 每日一题No.2
tags:
  - 程序设计
  - C++
categories:
  - ICPC-CCPC
abbrlink: 4d2ec778
mathjax: true
date: 2023-11-08 22:56:37
---


[题目来源：ABC326-F](https://atcoder.jp/contests/abc326/tasks/abc326_f)

<!--more-->

## DQ-2：Robot Rotation

### 题目描述：

一个机器人位于坐标平面的原点，坐标平面的正 $x$ 轴指向右侧，正 $y$ 轴指向上方。最初，机器人面向 $x$ 轴正方向。

您将依次对 $i=1,\ldots,N$ 执行以下操作。

- 将机器人顺时针或逆时针旋转 $90$ 度。然后，机器人沿着它所面对的方向向前移动 $A_i$ 个单位。

能否选择旋转方向，使机器人在进行$N$操作后位于坐标 $(X,Y)$ 处？

如果可以，请确定每次操作应选择顺时针还是逆时针方向。

### 问题分析：

首先可以很快速的观察到一个问题，每当机器人在一个坐标轴上行走一次之后，它会在下一次行走前左转或右转90度，这将决定每两次相邻的行走不在同一个坐标轴之上。

因此对于输入数据而言，奇数位的数据只可能在$Y$轴上作用，偶数位的数据只可能在$X$轴上作用。

接着分析能不能接着这个巧合将$X$和$Y$轴上的移动分开讨论，阻碍这个问题的只有一个：转弯的方向能否肯定确定。

1. ***如果在$X$的正方向（记作1）上行走后，左转是$Y$的正方向（记作1），右转是$Y$的负方向（记作-1）。***
2. ***如果在$Y$的正方向上行走后，左转是$X$的负方向（记作-1），右转是$X$的正方向***
3. ***如果在$X$的负方向行走后，左转是$Y$的负方向，右转是$Y$的正方向***
4. ***如果在$Y$的负方向行走后，左转是$X$的正方向，右转是$X$的负方向***
5. ***初始状态可以被认为是进行了一次长度为$0$的$X$轴正方向行走***

所以，***只要X的Y的每一步的正负走向决定了，具体是左转还是右转是一个关于X或Y的函数，不会因为分开求解而变化***。

接下来就可以对$X$和$Y$分开讨论，由于问题的相同性，接下来我们只关注$X$的问题。

现在，问题已经转化成了，给定$n$个数字，每一个数字可以选择正负号，是否存在一种选择方案使得决定了正负号的各个数字之和为定值$X$。

再观察一下数据范围($N<=80$),非常明显的深度优先搜索问题。

***但是，纯纯的深度优先搜索的话，可能的总情况数是$2^40$,而$4s$的平均可能运算量为$2e8$,严重超时。***

这就是本题接下来的精髓：***二分搜索***

### 算法核心

二分搜索，顾名思义。对于初始状态和结束状态都明确的搜索，可以从两头分别搜索数据的一半，最后查找两棵搜索树有没有重复的节点。如果有，证明这两条一半的路径可以合并为从起点到终点的一条完整的路径；否则，该路径不存在。



对于这个题，就可以先搜索给定数字的前$\frac{n}{2}$个，将所有可能的搜索结果$T$与搜索路径存放到$map$映射中；再搜索给定数字的后$\frac{n}{2}$个，将可能的搜索结果$S$扔到map中查询($O(nlogn)$)是否有$X-S$在$map$中存在。如果存在，合并搜索路径并返回。



因为两个大小为$\frac{n}{2}$的搜索都是从左往右对数据搜索的，所以路径合并的时候不会出现路径左右转颠倒的情况，可以直接合并。此时时间复杂度降到$O(2^{n/2})$，可以通过。



对于两坐标轴都搜索完之后，查询合并后路径$vector$是否非空，如果非空则输出$Yes$并通过前面所说的函数决定左右转，反之，***只要有任何一个总路径集合非空，就不能完成任务，输出$No$.***

### $AC$代码

```
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
ll n, X, Y;
vector<ll> x, y;
vector<ll> ans1, ans2, step, stepfinalx, stepfinaly;
vector<vector<ll>> step1, step2;
ll sizex, sizey;
map<ll, ll> mp;
void judge(ll i, ll x, ll y)
{
    if (i & 1)
    {
        if (x * y == 1)
            cout << "R";
        else if (x * y == -1)
            cout << "L";
    }
    else
    {
        if (x * y == 1)
            cout << "L";
        else if (x * y == -1)
            cout << "R";
    }
}
void dfs1(vector<ll> x, ll i, ll size, ll ans)
{
    if (i == size)
    {
        ans1.push_back(ans);
        step1.push_back(step);
        return;
    }
    step.push_back(1);
    dfs1(x, i + 1, size, ans + x[i]);
    step.pop_back();
    step.push_back(-1);
    dfs1(x, i + 1, size, ans - x[i]);
    step.pop_back();
    return;
}
void dfs2(vector<ll> x, ll i, ll size, ll ans)
{
    if (i == size)
    {
        ans2.push_back(ans);
        step2.push_back(step);
        return;
    }
    step.push_back(1);
    dfs2(x, i + 1, size, ans + x[i]);
    step.pop_back();
    step.push_back(-1);
    dfs2(x, i + 1, size, ans - x[i]);
    step.pop_back();
    return;
}
int main()
{
    cin >> n >> X >> Y;
    for (ll i = 1; i <= n; i++)
    {
        ll a;
        cin >> a;
        if (i & 1)
            y.push_back(a);
        else
            x.push_back(a);
    }
    sizex = x.size();
    sizey = y.size();
    dfs1(x, 0, sizex / 2, 0);
    for (ll i = 0; i < ans1.size(); i++)
        mp[X - ans1[i]] = i;
    dfs2(x, sizex / 2, sizex, 0);
    for (ll i = 0; i < ans2.size(); i++)
    {
        auto it = mp.find(ans2[i]);
        if (it != mp.end())
        {
            stepfinalx.insert(stepfinalx.begin(), step1[(*it).second].begin(), step1[(*it).second].end());
            stepfinalx.insert(stepfinalx.end(), step2[i].begin(), step2[i].end());
            break;
        }
    }
    step1.clear();
    step2.clear();
    ans1.clear();
    ans2.clear();
    mp.clear();
    dfs1(y, 0, sizey / 2, 0);
    for (ll i = 0; i < ans1.size(); i++)
        mp[Y - ans1[i]] = i;
    dfs2(y, sizey / 2, sizey, 0);
    for (ll i = 0; i < ans2.size(); i++)
    {
        auto it = mp.find(ans2[i]);
        if (it != mp.end())
        {
            stepfinaly.insert(stepfinaly.begin(), step1[(*it).second].begin(), step1[(*it).second].end());
            stepfinaly.insert(stepfinaly.end(), step2[i].begin(), step2[i].end());
            break;
        }
    }
    if (!(stepfinalx.empty() || stepfinaly.empty()))
    {
        cout << "Yes" << endl;
        ll finalstep[81];
        memset(finalstep, 0, sizeof(finalstep));
        for (ll i = 0; i < stepfinaly.size(); i++)
        {
            finalstep[2 * i + 1] = stepfinaly[i];
        }
        for (ll i = 0; i < stepfinalx.size(); i++)
        {
            finalstep[2 * i + 2] = stepfinalx[i];
        }
        finalstep[0] = 1;
        for (ll i = 0; i < n; i++)
        {
            judge(i, finalstep[i], finalstep[i + 1]);
        }
    }
    else
    {
        cout << "No" << endl;
    }
    cout<<endl;
    system("pause");
    return 0;
}
```



