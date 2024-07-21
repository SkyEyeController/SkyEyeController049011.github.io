---
title: Atcoder Beginner Contest 351
tags:
  - atcoder
  - C++
categories:
  - ICPC-CCPC
mathjax: true
abbrlink: deff2f0d
date: 2024-05-01 19:52:16
---

切比雪夫距离

<!--more-->

## ABC351E - Jump Distance Sum

#### 问题陈述

[E - Jump Distance Sum (atcoder.jp)](https://atcoder.jp/contests/abc351/tasks/abc351_e)

在坐标平面上有 $N$ 个点 $P_1, P_2, \ldots, P_N$ ，其中点 $P_i$ 的坐标为 $(X_i, Y_i)$ 。 
两点 $A$ 与 $B$ 之间的距离 $\text{dist}(A, B)$ 定义如下：

> 一只兔子最初位于点 $A$ 。 
> 位置为 $(x, y)$ 的兔子可以跳跃到 $(x+1, y+1)$ 、 $(x+1, y-1)$ 、 $(x-1, y+1)$ 或 $(x-1, y-1)$ 。 
> $\text{dist}(A, B)$ 被定义为从 $A$ 点跳到 $B$ 点所需的最少跳跃次数。 
> 如果经过任意次数的跳跃都无法从点 $A$ 到达点 $B$ ，则设为 $\text{dist}(A, B) = 0$ 。

计算总和 $\displaystyle\sum_{i=1}^{N-1}\displaystyle\sum_{j=i+1}^N \text{dist}(P_i, P_j)$​ 。

#### 题目解析

切比雪夫距离问题。

不难得出$dist(i,j)=max(|x_j-x_i|,|y_j-y_i|)$

（相当于给$k$个$1$填加减号，那么肯定最小的$k$​满足其中一个坐标全是加号）

坐标系翻转后就变成了求曼哈顿距离。
$$
(x,y)\rightarrow(\frac{x+y}{2},\frac{x-y}2)
$$


求曼哈顿距离就可以拆到横纵坐标上分开计算。[F - Robot Rotation (atcoder.jp)](https://atcoder.jp/contests/abc326/tasks/abc326_f)

对于$x$而言，
$$
\sum_{i=1}^n\sum_{j=i+1}^n |x_j-x_i|=\\
\sum_{i=1}^n|\sum_{j=i+1}^nx_j-(n-j+1)x_i|=\\
\sum_{i=1}^n(E-pre_i-(n-j+1)x_i)
$$

```
#include <bits/stdc++.h>
using namespace std;
#define int long long
const int mod = 998244353;
const int INF = 1e18;
using p = pair<int, int>;
#define IOS                      \
    ios::sync_with_stdio(false); \
    cin.tie(nullptr);            \
    cout.tie(nullptr)
signed main()
{
    IOS;
    int n;
    cin >> n;
    vector<p> even, odd;
    for (int i = 1; i <= n; i++)
    {
        int a, b;
        cin >> a >> b;
        if ((a + b) & 1)
        {
            odd.push_back({a, b});
        }
        else
            even.push_back({a, b});
    }
    vector<int> X, Y;
    int sumx = 0, sumy = 0;
    for (auto [x, y] : even)
    {
        X.push_back((x + y));
        sumx += (x + y);
        Y.push_back((x - y));
        sumy += (x - y);
    }
    sort(X.begin(), X.end()), sort(Y.begin(), Y.end());
    int ans = 0;
    for (int i = 0; i < X.size(); i++)
    {
        sumx -= X[i];
        ans += (sumx - (X.size() - i - 1) * X[i]);
    }
    for (int i = 0; i < Y.size(); i++)
    {
        sumy -= Y[i];
        ans += (sumy - (Y.size() - i - 1) * Y[i]);
    }
    X.clear(), Y.clear();
    sumx = 0, sumy = 0;
    for (auto [x, y] : odd)
    {
        X.push_back((x + y));
        sumx += (x + y);
        Y.push_back((x - y));
        sumy += (x - y);
    }
    sort(X.begin(), X.end()), sort(Y.begin(), Y.end());
    for (int i = 0; i < X.size(); i++)
    {
        sumx -= X[i];
        ans += (sumx - (X.size() - i - 1) * X[i]);
    }
    for (int i = 0; i < Y.size(); i++)
    {
        sumy -= Y[i];
        ans += (sumy - (Y.size() - i - 1) * Y[i]);
    }
    cout << ans / 2 << endl;
    system("pause");
    return 0;
    
}
```

## ABC351F - Double Sum

#### 问题陈述

给你一个整数序列 $A = (A_1, A_2, \dots, A_N)$ 。 
请计算以下表达式：
$$
\displaystyle \sum_{i=1}^N \sum_{j=i+1}^N \max(A_j - A_i, 0)
$$
约束条件保证答案小于 $2^{63}$ 。

#### 题目解析

问题极易转化成求$A_i$后面所有比$A_i$大的数的数量和总和。

树状数组求逆序对既视感。

排序后从小到大将目标数插入到对应位置，维护两个树状数组，求后缀总和和后缀个数，完事。

```
#include <bits/stdc++.h>
using namespace std;
#define int long long
const int mod = 998244353;
const int INF = 1e18;
using p = pair<int, int>;
#define IOS                      \
    ios::sync_with_stdio(false); \
    cin.tie(nullptr);            \
    cout.tie(nullptr)
#define lowbit(x) x & (-x)
struct BIT
{
    vector<int> bit;
    int n;
    BIT(int n) : n(n)
    {
        bit.resize(n + 1);
    }
    void add(int x, int val)
    {
        for (int i = x; i <= n; i += lowbit(i))
            bit[i] += val;
    }
    int sum(int x)
    {
        int res = 0;
        for (int i = x; i > 0; i -= lowbit(i))
            res += bit[i];
        return res;
    }
    int sum(int l, int r)
    {
        return sum(r) - sum(l - 1);
    }
};
signed main()
{
    IOS;
    int n;
    cin >> n;
    vector<pair<int, int>> q(n);
    int cnt = 0;
    for (auto &p : q)
    {
        int u;
        cin >> u;
        p = {u, ++cnt};
    }
    sort(q.begin(), q.end());
    BIT bit1(n), bit2(n);
    int ans = 0;
    for (auto p : q)
    {
        int u = p.first, pos = p.second;
        bit1.add(pos, 1);
        bit2.add(pos, u);
        ans += u * bit1.sum(pos - 1) - bit2.sum(pos - 1);
    }
    cout << ans << endl;
    system("pause");
    return 0;
}
```

