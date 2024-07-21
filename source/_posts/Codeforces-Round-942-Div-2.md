---
title: Codeforces Round 942 Div.2
tags:
  - codeforces
  - C++
categories:
  - ICPC-CCPC
mathjax: true
abbrlink: 5ad558a9
date: 2024-05-01 19:53:20
---

最猜结论的一场

数论、二分、数据结构（多次方树状数组，挺有意思的）

<!--more-->

# CF1972E. Fenwick Tree

#### 题目信息

[Problem - E - Codeforces](https://codeforces.com/contest/1972/problem/E)

让 $\operatorname{lowbit}(x)$ 表示 $x$ 最低二进制位的值，例如 $\operatorname{lowbit}(12)=4$ , $\operatorname{lowbit}(8)=8$ 。

对于长度为 $n$ 的数组 $a$ ，如果长度为 $n$ 的数组 $s$ 满足所有 $k$ 的 $s_k=\left(\sum\limits_{i=k-\operatorname{lowbit}(k)+1}^{k}a_i\right)\bmod 998\,244\,353$ ，那么 $s$ 称为 $a$ 的芬威克树（树状数组）。记作 $s=f(a)$ 。

对于正整数 $k$ 和数组 $a$ ， $f^k(a)$ 的定义如下：

$$
f^k(a)= \begin{cases} f(a)&\textrm{if }k=1\\ f(f^{k-1}(a))&\textrm{otherwise.}\\ \end{cases}
$$

给你一个长度为 $n$ 的数组 $b$ 和一个正整数 $k$ 。求满足 $0\le a_i < 998\,244\,353$ 和 $f^k(a)=b$ 的数组 $a$ 。可以证明答案总是存在的。如果有多个可能的答案，你可以打印其中任何一个。

#### 题目解析

很头疼的一个东西。

树状数组的结构如下：

![img](https://espresso.codeforces.com/821a14f5fb9e492d56e7a5ec3c4f5520636ea0bd.png)

乍一看无从下手，$RegenFallen$是先打的表模拟的$n=8,k=3$

```cpp
#include <bits/stdc++.h>
using namespace std;
int main()
{
    int a[9] = {0, 1, 2, 3, 4, 5, 6, 7, 8};
    int k;
    cin >> k;
    for (int i = 1; i <= 8; i++)
        cout << a[i] << " ";
    cout << endl;
    while (k--)
    {
        for (int i = 1; i <= 7; i++)
            a[8] += a[i];
        a[6] += a[5];
        for (int i = 1; i <= 3; i++)
            a[4] += a[i];
        a[2] += a[1];
        for (int i = 1; i <= 8; i++)
            cout << a[i] << " ";
        cout << endl;
    }
    system("pause");
}
```

模拟结果如下：

```
1 2 3 4 5 6 7 8
1 3 3 10 5 11 7 36
1 4 3 17 5 16 7 76
1 5 3 25 5 21 7 129
```

观察贡献情况，发现以下特点：

对于`25`而言，其是由`1`贡献6次，`2`和`3`贡献3次，`4`贡献1次而来的。

这是一个多重前缀和的贡献

```
1 1 1  1  1  1  1  1
1 2 3  4  5  6  7  8
1 3 6  10 15 21 28 36
1 4 10 16 26 41 62 90
```

讨论`129`

`129`中，`1`贡献距离为$3$，贡献值为$10\times1$；`2`贡献距离为$2$,贡献值为$6\times2$;

`3`为$6\times 3$；`4`为$3\times 4$；`5`为$6\times 5$；`6`为$3\times 6$；`7`为$3\times 7$；`8`为$1\times8$​.
其实不难理解，每一次都是前缀和贡献之后再前缀和。

$\color{green}Accepted.$

问题在于如何维护贡献系数。

```
    j 0 1 2  3  4  5  6  7   
i=0   1 1 1  1  1  1  1  1
i=1	  1 2 3  4  5  6  7  8
i=2   1 3 6  10 15 21 28 36
i=3	  1 4 10 20 35 56 84 120
```

$a_{i,j}$表示$i$贡献距离下累计$j$次。
$$
\Large a_{i,j}=\frac{i\times(i+1)\times\cdots\times(i+j)}{j!}=C_{i+j}^j
$$
本题中，贡献即为$\Large\tbinom{\Delta d+k-1}{\Delta d}$​

然后注意到一个问题就是$k$​很大，不能直接暴力线性递推阶乘计算。

注意到$\Delta d$很小(树状数组深度是$log\ n$的)，所以枚举每一项就行了。

之前已经讨论过了阶乘线性递推的逆元解法，但是这里要求的不是线性阶乘的逆元。

递推方式如下：

```cpp
	inv[0]=inv[1]=1;
    n = maxn - 1;
    for (int i=2;i<=n;i++) inv[i] = (mod-mod/i)*inv[mod%i]%mod;
```

然后暴力树状数组就行了。

```cpp
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
const int maxn = 2e5 + 1;
#define lowbit(x) (x & -x)
int inv[51];
int quickpow(int a, int b)
{
    int e = 1;
    while (b)
    {
        if (b & 1)
            (e *= a) %= mod;
        (a *= a) %= mod;
        b >>= 1;
    }
    return e;
}
int quickinv(int a)
{
    return quickpow(a, mod - 2);
}
int n, k;
int num[51];
void init()
{
    inv[0] = inv[1] = 1;
    for (int i = 2; i <= 50; i++)
    {
        inv[i] = (mod - mod / i) * inv[mod % i] % mod;
    }
}
void solve()
{

    cin >> n >> k;
    vector<int> a(n + 1);
    for (int i = 1; i <= n; i++)
    {
        cin >> a[i];
    }
    for (int i = 1; i <= 50; i++)
    {
        int mul = 1;
        num[i] = 1;
        for (int j = 1; j <= i; j++)
        {
            (num[i] *= (j + k - 1)) %= mod;
            (num[i] *= inv[j]) %= mod;
        }
    }
    for (int i = 1; i <= n; i++)
    {
        int depth = 0;
        for (int j = i + lowbit(i); j <= n && j != i; j += lowbit(j))
        {
            depth++;
            a[j] = (a[j] - (a[i] * num[depth] % mod) + mod) % mod;
        }
    }
    for (int i = 1; i <= n; i++)
    {
        cout << a[i] << " ";
    }
    cout << endl;
    return;
}
signed main()
{
    IOS;
    int t;
    init();
    cin >> t;
    while (t--)
    {
        solve();
    }
    system("pause");
    return 0;
}
```

# CF1972D. Reverse Card

#### 题目信息

[Problem - D1 - Codeforces](https://codeforces.com/contest/1972/problem/D1)

[Problem - D2 - Codeforces](https://codeforces.com/contest/1972/problem/D2)

**两个版本的问题不同。您可能需要同时阅读两个版本。只有两个版本的问题都解决了，您才能进行Hack。**

给你两个正整数 $n$ , $m$ 。

计算满足以下条件的有序数对 $(a, b)$ 的个数：

- $1\le a\le n$ , $1\le b\le m$ ;
- ***EasyVersion:*** $a+b$ 是 $b \cdot \gcd(a,b)$​ 的倍数。
- ***HardVersion:***$b \cdot \gcd(a,b)$ 是$a+b $ 的倍数。

#### 题目解析

数学题。

简单版本显然有$gcd(a,b)=b$，然后暴力枚举$b$，时间复杂度为线性。

讨论困难版本。

显然有
$$
(a+b)\ |\ b\cdot gcd(a,b)\\
\rightarrow(u_1+u_2)d\ | \ bd\\
\rightarrow(u_1+u_2)\ | \ b\\
\\
gcd(a,b)=d,gcd(u_1,u_2)=1,b=u_2d.
$$
注意到$gcd(u_1,u_2)=1$，必然有$gcd(u_1,u_2+u_1)=1$

所以必然有
$$
\Large (u_1+u_2)\ | \ d
$$
因为$a=u_1d,b=u_2d$，考虑枚举$u_1,u_2$.(最难想到的一点)

注意到$(u_1+u_2)\ | \ d \rightarrow u_1<d\rightarrow u_1^2<a$；同理$u_2^2<b$

时间复杂度$O(n\sqrt n)$

$\color{green}Accepted.$

```cpp
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
int n, m;
void solve()
{
    cin >> n >> m;
    int ans = 0;
    for (int i = 1; i * i < n; i++)
    {
        for (int j = 1; j * j < m; j++)
        {
            if (__gcd(i, j) == 1)
            {
                ans += min((n / i) / (i + j), (m / j) / (i + j));
            }
        }
    }
    cout << ans << endl;
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

# CF1972C.Permutation Counting

#### 题目信息

[Problem - C - Codeforces](https://codeforces.com/contest/1972/problem/C)

你有几张牌。每张卡片上都写着一个介于 $1$ 和 $n$ 之间的整数：具体来说，从 $1$ 到 $n$ 的每张卡片上都写着 个数字$a_i$。

还有一个商店，里面有无限量的各种类型的卡片。你有 $k$ 枚金币，因此你总共可以购买 $k$ 张新卡片，你所购买的卡片可以包含 $1$ 到 $n$ 之间的任意整数。

购买新牌后，您要将所有牌重新排列成一行。重新排列的得分是长度为 $n$ 的（连续）子数组中 $[1, 2, \ldots, n]$ 的排列数。你能得到的最高分是多少？

#### 题目解析

根据样例不难想到要把完整的套牌全部挑出来然后排成排列序。

限制因素是最少的牌，我们可以补充最少的牌来增加完整套牌的总数。答案具有单调性，可以二分答案。

得到完整套牌的最大值之后，剩余的牌如何处理？实际上，必然有一种排列方式能使得剩下的这些牌种类无论以什么顺序跟在完整套牌群的末尾，都能继续构成新的排列。

（显然，通过这些剩下的牌定排列顺序就行了）

比如说完整套牌为12345，你现在剩下了1 1 3 5，总计三种牌。那么就可以有一个排列顺序为13524，使得135能够跟在前序完整套牌组的后面,再延伸三种满足的条件：

$\color{green}1\ 3\ 5\ 2\ 4\ 1\ 3\ 5\ 2\ 4\ \cdots1\ 3\ 5\ 2\ 4\ \color{orange}\ 1\ 3 \ 5\ \color{red}1\ $

再剩下的$1$​就无法再延续结果了。

然后，如果你手里还有可以购买的e额度，就继续延伸答案即可。

```cpp
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
vector<int> a;
int n, k;
bool check(int x)
{
    int now = k;
    for (int i = 1; i <= n; i++)
    {
        if (a[i] < x)
            now -= (x - a[i]);
        if (now < 0)
            return false;
    }
    return true;
}

void solve()
{
    cin >> n >> k;
    a = vector<int>(n + 1);
    for (int i = 1; i <= n; i++)
        cin >> a[i];
    if (n == 1)
    {
        cout << a[1] + k << endl;
        return;
    }
    int l = 0, r = 1e18 + 1;
    while (l < r)
    {
        int mid = (l + r) >> 1LL;
        if (check(mid))
            l = mid;
        else
            r = mid;
    }
    for (int i = 1; i <= n; i++)
    {
        if (a[i] < l)
            k -= (l - a[i]);
    }
    int pos;
    int ans = (l - 1) * n + 1;
    for (int i = 1; i <= n; i++)
    {
        if (a[i] > l)
            ans++;
    }
    ans += k;
    cout << ans << endl;
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

# CF1972.B Coin Games

#### 题目信息

[Problem - B - Codeforces](https://codeforces.com/contest/1972/problem/B)

桌子上有 $n$ 枚硬币围成一个圆圈，每枚硬币要么朝上，要么朝下。爱丽丝和鲍勃轮流玩下面的游戏，爱丽丝先玩。

在每次操作中，玩家选择一枚正面朝上的硬币，取出硬币并翻转与其相邻的两枚硬币。如果（操作前）只剩下两枚硬币，则取出一枚，另一枚不翻转（因为会翻转两次）。如果（操作前）只剩下一枚硬币，则不会翻转任何硬币。如果（操作前）没有正面朝上的硬币，玩家就输了。

如果两人都以最佳方式下棋，谁会赢呢？可以证明，游戏将在有限次的操作中结束，其中一人将获胜。

#### 题目解析

当$U$的数量为$0$​的时候，先手必败。

假定序列里全是$U$，$U=1$时先手必胜。

$U=2$时先手必败，$U=3$时先手必胜。

可以推出，$U$为奇数个时先手必胜，偶数个先手必败。

考虑所有可能的操作：

- $...UUU...->...DD......:$$U$ 的个数减少 $3$ 。
- $...UUD...->...DU...:U$ 的数量减少 $1$ 。
- $...DUU...->...UD...:U$ 的数量减少 $1$ 。
- $...DUD... -> ...UU...:U$ 的数量增加了 $1$ 。

每一次操作，序列中$U$的元素个数的奇偶性都一直在变化。

故猜测$U$的个数为奇数个的时候先手必胜。

嗯，就硬猜。

```cpp
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
    string s;
    cin >> s;
    int ans = 0;
    bool flag = false;
    for (auto p : s)
    {
        flag ^= (p == 'U');
    }
    if (flag)
        cout << "Yes" << endl;
    else
        cout << "No" << endl;
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

