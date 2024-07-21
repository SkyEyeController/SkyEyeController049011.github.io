---
title: CodeForces Round 943Div.3
tags:
  - codeforces
  - C++
categories:
  - ICPC-CCPC
mathjax: true
abbrlink: bb8dcd31
date: 2024-05-03 11:31:25
---

二分场

$Stop\ learning\ useless\ algrithom\ ，go\ and\ solve\ some\ problems,\ try\ to\ use\ Binary\ Search$

<!--more-->

# CF1968B.Prefiquence

#### 题目信息

给你两个二进制字符串 $a$ 和 $b$ 。二进制字符串是由字符 "0 "和 "1 "组成的字符串。

您的任务是确定最大可能的数字 $k$ ，使得长度为 $k$ 的字符串 $a$ 的前缀是字符串 $b$ 的子序列。

如果 $a$ 可以从 $b$ 中通过删除几个（可能是零个或全部）元素得到，那么序列 $a$ 就是序列 $b$ 的子序列。

**输入**

第一行包含一个整数 $t$ ( $1 \le t \le 10^4$ ) - 测试用例数。

每个测试用例的第一行包含两个整数 $n$ 和 $m$ ( $1\le n,m \le 2 \cdot 10^5$ ) - 分别是字符串 $a$ 的长度和字符串 $b$ 的长度。

每个测试用例的第二行包含长度为 $n$ 的二进制字符串 $a$ 。

每个测试用例的第三行包含长度为 $m$ 的二进制字符串 $b$ 。

保证所有测试用例的值 $n$ 之和不超过 $2 \cdot 10^5$ 。同样，所有测试用例中 $m$ 的值之和不超过 $2 \cdot 10^5$ 。

#### 题目解析

赛时写的有点慢。这里主要讨论$dp$角度思考，赛时写的暴力维护。

暴力线性围护的时候，需记录对应位置字符下一次出现的地方方便跳转。

讨论$dp$，设$dp_i$表示$b_{1\sim i}$的子序列最多能包含$a$前缀的长度。

则有转移方程
$$
dp[i]=max( dp[i-1],dp[i-1]+( b[i]==a[dp[i-1]+1]) )
$$
最终结果就是$dp[m].$

```
#include <bits/stdc++.h>
using namespace std;
using p = pair<int, int>;
#define IOS                      \
    ios::sync_with_stdio(false); \
    cin.tie(nullptr);            \
    cout.tie(nullptr);
#define int long long
const int INF = 1e18;
const int mod = 998244353;
void solve()
{
    int n, m;
    cin >> m >> n;
    string a, b;
    cin >> a >> b;
    vector<int> nxt0(b.size() + 2);
    vector<int> nxt1(b.size() + 2);
    nxt0[b.size()] = nxt1[b.size()] = INF;
    int pre0 = INF, pre1 = INF;
    for (int i = n; i >= 0; i--)
    {
        nxt0[i] = pre0;
        nxt1[i] = pre1;
        if (i)
        {
            if ((b[i - 1] & 15) == 0)
            {
                pre0 = i;
            }
            else
            {

                pre1 = i;
            }
        }
    }
    int k = 0;
    int pos = 0;
    for (auto c : a)
    {
        if (c == '0')
        {
            if (nxt0[pos] == INF)
                break;
            pos = nxt0[pos];
            k++;
        }
        else
        {
            if (nxt1[pos] == INF)
                break;
            pos = nxt1[pos];
            k++;
        }
    }
    cout << k << endl;
    return;
}
signed main()
{
    IOS;
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

# CF1968D. Permutation Game

#### 题目信息

[Problem - D - Codeforces](https://codeforces.com/contest/1968/problem/D)

Bodya 和 Sasha 发现了一个排列 $p_1,\dots,p_n$ 和一个数组 $a_1,\dots,a_n$ 。他们决定玩一个著名的 "排列游戏"。

长度为 $n$ 的排列是一个数组，由 $n$ 个不同的整数组成，这些整数从 $1$ 到 $n$ 按任意顺序排列。例如， $[2,3,1,5,4]$ 是一个排列，但 $[1,2,2]$ 不是一个排列（ $2$ 在数组中出现了两次）， $[1,3,4]$ 也不是一个排列（ $n=3$ 但数组中有 $4$ ）。

它们都在排列中选择了一个起始位置。

对局持续了 $k$ 个回合。棋手同时下棋。在每个回合中，每个棋手都会发生两件事：

- 如果棋手当前的位置是 $x$ ，他的得分就会增加 $a_x$ 。
- 然后棋手要么**停留**在当前位置 $x$ ，要么**从 $x$ 移动**到 $p_x$ 。

在整整 $k$ 个回合后，得分较高的棋手即为获胜者。

知道了博迪娅的起始位置 $P_B$ 和萨沙的起始位置 $P_S$ 后，如果双方都想获胜，那么谁会赢得对局？

#### 题目解析

很快能想到最终的结果不会和博弈相关，因为两人的选择互不干扰。

所以两人都玩命想更大就行了。

最优解是从当前位置走到能到达的范围内某个分数较高的格子里面不动。注意到不一定是最大的，因为到达最大格子可能付出更沉重的代价。

但是，停留行为是一定的。

所以我们枚举停留点就行了，计算从初始点一路走到停留点停下所能得到的分数，比较出最大值就可以。

```
#include <bits/stdc++.h>
using namespace std;
using p = pair<int, int>;
#define IOS                      \
    ios::sync_with_stdio(false); \
    cin.tie(nullptr);            \
    cout.tie(nullptr);
#define int long long
const int INF = 1e18;
const int mod = 998244353;
void solve()
{
    int n, k, posb, poss;
    cin >> n >> k >> posb >> poss;
    vector<int> a(n + 1), b(n + 1);
    for (int i = 1; i <= n; i++)
        cin >> a[i];
    for (int j = 1; j <= n; j++)
        cin >> b[j];
    int anss, ansb;
    vector<int> maxnb(1), maxns(1);
    vector<int> dpb(n + 1), dps(n + 1);
    vector<int> rb(1), rs(1);
    vector<int> vis(n + 1, 0);
    int _posb = posb, _poss = poss;
    int maxx = -1;
    while (!vis[_posb])
    {
        rb.push_back(b[_posb]);
        vis[_posb] = 1;
        maxx = max(maxx, b[_posb]);
        _posb = a[_posb];

        maxnb.push_back(maxx);
    }
    maxx = -1;
    vis = vector<int>(n + 1, 0);
    while (!vis[_poss])
    {
        rs.push_back(b[_poss]);
        vis[_poss] = 1;
        maxx = max(maxx, b[_poss]);
        _poss = a[_poss];
        maxns.push_back(maxx);
    }
    int pre = 0;
    for (int i = 1; i < rb.size(); i++)
    {
        pre += rb[i];
        dpb[i] = max(dpb[i - 1], k - i >= 0 ? (pre + (k - i) * maxnb[i]) : 0);
    }
    pre = 0;
    for (int i = 1; i < rs.size(); i++)
    {
        pre += rs[i];
        dps[i] = max(dps[i - 1], k - i >= 0 ? (pre + (k - i) * maxns[i]) : 0);
    }
    ansb = dpb[rb.size() - 1], anss = dps[rs.size() - 1];
    if (anss > ansb)
    {
        cout << "Sasha" << endl;
        return;
    }
    if (anss < ansb)
    {
        cout << "Bodya" << endl;
        return;
    }
    cout << "Draw" << endl;
    return;
}
signed main()
{
    IOS;
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

# CF1968E.Cells Arrangement

#### 题目信息

给你一个整数 $n$ 。您在网格 $n\times n$ 中选择了 $n$ 个单元格 $(x_1,y_1), (x_2,y_2),\dots,(x_n,y_n)$ ，其中 $1\le x_i\le n$ 和 $1\le y_i\le n$ 。

假设 $\mathcal{H}$ 是任意一对单元格之间**不同**的曼哈顿距离集合。你的任务是最大化 $\mathcal{H}$ 的大小。注释中给出了集合及其构造的例子。

**如果存在多个解，你可以输出任意一个。**

单元格 $(x_1,y_1)$ 和 $(x_2,y_2)$ 之间的曼哈顿距离等于 $|x_1-x_2|+|y_1-y_2|$ 。

#### 题目解析

纯$SB$​构造

还不如$D.$

显然这种题看样例看多了就是给自己找麻烦。

观察情况数最少的$n=2$以及$n=3$，样例只给了$n=3$的一种情况，而另一种情况就是正解。

注意考虑下面样例都有对角线，构造题一定是递推的关系，不同情况之间一定有联系。

然后逆天小题就结束了。

![ ](https://codeforces.com/predownloaded/38/4e/384e43e3518619d3898e56bc9d04d6ba10380219.png)

## CF1968F. Equal XOR Segments

#### 题目信息

如果可以将数组分成 $k>1$ 部分，使得每一部分的值的 [bitwise XOR](http://tiny.cc/xor_wiki_eng) 都相等，那么我们就称这个数组 $x_1,\dots,x_m$ 为有趣的数组。

更正式地说，你必须把数组 $x$ 分成 $k$ 个连续的部分，而 $x$ 中的每个元素都必须完全**属于 $1$ 部分。设 $y_1,\dots,y_k$ 分别是各部分元素的 XOR。那么 $y_1=y_2=\dots=y_k$ 必须满足。

例如，如果是 $x = [1, 1, 2, 3, 0]$ ，则可以将其拆分如下： $[\color{blue}1], [\color{green}1], [\color{red}2, \color{red}3, \color{red}0]$ .事实上是 $\color{blue}1=\color{green}1=\color{red}2 \oplus \color{red}3\oplus \color{red}0$ 。

给你一个数组 $a_1,\dots,a_n$ 。你的任务是回答 $q$ 个查询：

- 对于固定的 $l$ , $r$ , 判断子数组 $a_l,a_{l+1},\dots,a_r$ 是否有趣。

**输入**

第一行包含一个整数 $t$ ( $1\le t\le 10^4$ ) - 测试用例数。

每个测试用例的第一行包含两个整数 $n$ 和 $q$ ( $2 \le n \le 2 \cdot 10^5$ , $1 \le q \le 2 \cdot 10^5$ )--分别是数组中的元素个数和查询次数。

下一行包含 $n$ 个整数 $a_1,\dots,a_n$ （ $0 \le a_i < 2^{30}$ ）。( $0 \le a_i < 2^{30}$ ) - 数组元素。

接下来的每行 $q$ 都包含两个整数 $l$ 和 $r$ ( $1 \le l < r \le n$ )，用于描述查询。

保证所有测试用例中 $n$ 的总和不超过 $2 \cdot 10^5$ 。

保证所有测试用例中 $q$ 的总和不超过 $2 \cdot 10^5$ 。

#### 题目解析

异或区间想前缀和已经基本属于是$PTSD$了

[Problem - 1957D - Codeforces](https://codeforces.com/problemset/problem/1957/D)

考虑分片的问题。赛场上就有想到，如果区间异或$[l,r]$结果为$0$，那么必然是可以分片的。

显然易证——如果区间$[l,r]$内异或和为$0$，取$[l,l+1]$和$[l+1,r]$片.

那么我们只需要专注区间异或结果不为$0$的。显然，区间结果不为$0$**只能分成奇数片**

更近一步的，说明如果存在可能的分片，那么其必然可以**分成三片**。

设可能的分片方式为$(l-1,s1],(s1,s2],(s2,r].$

则必然有
$$
sum_{l-1}\oplus sum_{s_1}=sum_{s_1}\oplus sum_{s_2}=sum_{s_2}\oplus sum_{r}
$$
即$sum_{l-1}=sum_{s2},sum_{r}=sum_{s_1}$，要求$s_1<s_2$

故问题转化成找区间$[l,r]$内最后一个出现$sum_{l-1}$的位置（$r$之前第一个）$P_{s_2}$和第一次出现$sum_{r}$的位置（$l$之后第一个）$P_{s_1}$，要求$P_{s_1}<P_{s_2}$.不满足则无解。

预处理前缀和时$res$​出现的所有位置，开`map<int,set<int>>`然后执行`set::lower_bound()`就行。

```
auto judge = [&](int l, int r, int tar) -> bool
    {
        auto s1 = mp[sum[r]].lower_bound(l);
        auto s2 = mp[sum[l - 1]].lower_bound(r);
        if (s1 == mp[sum[r]].end() || s2 == mp[sum[l - 1]].begin())
            return false;
        s2--;
        if (*s1 < *s2)
            return true;
        return false;
    };
```

```
#include <bits/stdc++.h>
using namespace std;
using p = pair<int, int>;
#define IOS                      \
    ios::sync_with_stdio(false); \
    cin.tie(nullptr);            \
    cout.tie(nullptr);
#define int long long
const int INF = 1e18;
const int mod = 998244353;
void solve()
{
    int n;
    cin >> n;
    int q;
    cin >> q;
    vector<int> a(n + 1);
    vector<int> sum(n + 1);
    map<int, set<int>> mp;
    for (int i = 1; i <= n; i++)
    {
        cin >> a[i];
        sum[i] = sum[i - 1] ^ a[i];
        mp[sum[i]].insert(i);
    }

    auto judge = [&](int l, int r, int tar) -> bool
    {
        auto s1 = mp[sum[r]].lower_bound(l);
        auto s2 = mp[sum[l - 1]].lower_bound(r);
        if (s1 == mp[sum[r]].end() || s2 == mp[sum[l - 1]].begin())
            return false;
        s2--;
        if (*s1 < *s2)
            return true;
        return false;
    };
    while (q--)
    {
        int l, r;
        cin >> l >> r;
        int res = sum[l - 1] ^ sum[r];
        if (!res)
        {
            cout << "YES" << endl;
        }
        else
        {
            if (judge(l, r, res))
            {
                cout << "YES" << endl;
            }
            else
                cout << "NO" << endl;
        }
    }

    return;
}
signed main()
{
    IOS;
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

# CF1968G2. Division + LCP (hard version)

扩展$KMP$

咕咕
