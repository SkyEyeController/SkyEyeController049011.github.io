---
title: Codeforces Round 941 Div.2
tags:
  - codeforces
  - C++
categories:
  - ICPC-CCPC
mathjax: true
abbrlink: 6b3d4234
date: 2024-05-01 19:53:11
---

构造场。

<!--more-->

# CF1966D.Missing Subsequence Sum

#### 题目信息

[Problem - D - Codeforces](https://codeforces.com/contest/1966/problem/D)

给你两个整数 $n$ 和 $k$ 。求一个大小最多为 $25$ 的非负整数序列 $a$ ，使得下列条件成立。

- 没有和为 $k$ 的 $a$ 的子序列。
- 对于 $v \ne k$ 所在的所有 $1 \le v \le n$ ，存在一个和为 $v$ 的 $a$ 的子序列。

如果 $b$ 可以从 $a$ 中删除几个（可能是零个或全部）元素，而不改变其余元素的顺序，那么序列 $b$ 就是 $a$ 的子序列。例如， $[5, 2, 3]$ 是 $[1, 5, 7, 8, 2, 4, 3]$ 的子序列。

可以证明，在给定的约束条件下，解总是存在的。

**输入**

输入的第一行包含一个整数 $t$ ( $1 \le t \le 1000$ )--测试用例的数量。测试用例说明如下。

每个测试用例由一行组成，包含两个整数 $n$ 和 $k$ ( $2 \le n \le 10^6$ , $1 \le k \le n$ )--上述参数。

保证所有测试用例中 $n$ 的总和不超过 $10^7$ 。

#### 题目解析

首先数据范围$1e6(2^{20}左右)$基本是把二进制构造怼到了脸上。

首先想到本题最终和$n$没有关系，我的目标就是构造长度为$25$的数组。

如果没有$k$的限制，我的构造顺序就完全可以如下：
$$
1,2,4,8,16,32,\cdots,2^{21},2^{22},2^{23},2^{24},2^{25}.
$$
很好，现在的问题是要求序列不存在和为$k$​的子序列。

那么首先第一点，$2^t$这一项要被$ban$掉。此处$t=\lfloor log_2k\rfloor.$

这一项$ban$掉以后，比$k$小的项最多构造到$2^{t}-1$，不会超过$k$.

此时，序列会空余出区间$[\color{orange}2^t,\color{orange}2^{t+1}-1\color{black}]$无法构造.

区间补充$\color{green}k+1$和$\color{green}k-2^t$,即可填充$[2^t,k-1]\cup[k+1,2\times k]$

$[k+1,2\times k]\supseteq[k+1,2^{t+1}]$​

***接下来是重点。***

问题解决了么？

还没有。

对于目标数$v>k$，我们采取$v=(k+1)+r$凑取。

对于$r$采用二进制表示，依旧可能使用到$k$，更进一步的，使用到$2^t$.

如何填补被挖去的$2^t$，只需将$k+1$置换成$k+1+2^t$即可保证。

所以还需要补充$k+1+2^t$.

```cpp
#include <bits/stdc++.h>
using namespace std;
#define int long long
#define IOS                      \
    ios::sync_with_stdio(false); \
    cin.tie(nullptr);            \
    cout.tie(nullptr);
void solve()
{
    int n, k;
    cin >> n >> k;
    vector<int> a;
    int log = __lg(k);
    int sum = 0;
    for (int i = 0; i < log; i++)
    {
        a.push_back(1LL << i);
        sum += 1LL << i;
    }
    if (k - 1 - sum)
        a.push_back(k - 1 - sum);
    sum = k - 1;
    a.push_back(k + 1);
    a.push_back(k + 1 + (1LL << log));
    while (a.size() < 25)
    {
        log++;
        a.push_back((1LL << log));
    }
    cout << 25 << endl;
    for (auto p : a)
    {
        cout << p << " ";
    }
    cout << endl;
}
signed main()
{
    int t;
    cin >> t;
    while (t--)
    {
        solve();
    }
    system("pause");
    return 0;
}
```

# CF1966C.Everything Nim

#### 题目信息

[Problem - C - Codeforces](https://codeforces.com/contest/1966/problem/C)

爱丽丝和鲍勃正在玩一个关于 $n$ 堆石头的游戏。轮到每个玩家时，他们都会选择一个正整数 $k$ ，这个正整数最多等于最小的**非空**堆的大小，然后从**每个非空堆**中**一次性**取出 $k$ 个石子。第一个无法下棋的棋手（因为所有棋子都是空的）就算输。

既然爱丽丝先下，如果双方都以最佳方式下棋，谁会赢得比赛？

#### 题目解析

如果只有一堆石子，那么$Alice$​必然获胜。

进一步的说，如果能够控制最后一对石子是自己先手，那么可以做到这一点的人必胜。

同理，可以简单推理出相同个数的石子堆不具有影响答案的能力，可以视作$s$​堆石子个数各不相同的石子堆。

考虑先手必胜，如果有$s$堆各不相同的石子，那么先手想控制最后一堆的先手权，只需要每次**迫使**后手拿走自己拿的那一堆的所有石子，因为后手想赢不会主动这么做。

所以对于最少有$p$个石子的石子堆，先手要拿$p-1$个，迫使后手只能拿一个，经过一个回合消除一堆石子。

问题在于如果先手操作过程中导致了自己下一次拿只能拿一个丢了先手权如何处理。

设当前最少得石子堆为$p(p\ge 2)$，第二少的为$p+1$。

如果先手拿$p-1$，那么后手拿$1$，先手下一次只能拿$1$，先手权被迫让出。

那么此时先手可以直接拿走$p$，迫使后手得到的先手权再转移回自己手中。

也就是说，率先面对当前操作的石子堆石子个数$p\ge2$时的人，有必胜决定方案，无论后续先手权的转移次数如何，当前人的一定可以将最后一堆的先手权握到自己手里。

```cpp
#include <bits/stdc++.h>
using namespace std;
void solve()
{
    int n;
    cin >> n;
    set<int> s;
    for (int i = 1; i <= n; i++)
    {
        int u;
        cin >> u;
        s.insert(u);
    }
    int size = s.size();
    if (size == 1)
    {
        cout << "Alice" << endl;
        return;
    }
    bool flag = 0;
    int cnt = 0;
    while (!s.empty())
    {
        int top = *s.begin();
        if (top == cnt + 1)
        {
            flag ^= 1;
            cnt = top;
            s.erase(top);
        }
        else
            break;
    }
    if (s.empty())
    {
        if (flag)
            cout << "Alice" << endl;
        else
            cout << "Bob" << endl;
    }
    else
    {
        if (flag)
            cout << "Bob" << endl;
        else
            cout << "Alice" << endl;
    }
}
int main()
{
    int t;
    cin >> t;
    while (t--)
    {
        solve();
    }
    system("pause");
    return 0;
}
```



