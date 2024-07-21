---
title: Codeforces Round 940Div.2
tags:
  - codeforces
  - C++
categories:
  - ICPC-CCPC
mathjax: true
abbrlink: ddd6aad1
date: 2024-04-22 14:19:47
---

数学场。

位运算+前缀和+数论（组合数学+威尔逊定理）

<!--more-->

# CF1957B A BIT of a Construction

## 题目信息

给定整数 $n$ 和 $k$ ，构造一个由 $n$ 非负数（即 $\geq 0$ ）整数 $a_1, a_2, \ldots, a_n$ 组成的序列，使得

1.  $\sum\limits_{i = 1}^n a_i = k$
2.  最大化 $a_1 | a_2 | \ldots | a_n$ 的二进制表示中$1$ 的个数，其中 $|$ 表示[位向 OR 运算](https://en.wikipedia.org/wiki/Bitwise_operation#OR)。

## 题目分析

很快想到最终计算结果中1越多越好，但是最后想歪了。

最多的1肯定是离$k$最近的二进制$2^{log_2k}-1$.这样一个数就可以全部盖满。而比赛时错误的想每一个数都提供一个二进制位，这样会造成一个风险就是$n$不够填完$log_2k$个$1$，这样就寄了。

所以只需要两个数就可以完成，剩下的全填$0$就可以了。



# CF1957C How Does the Rook Move?

## 题目信息

给您一个 $n \times n$ 棋盘，您和电脑轮流在棋盘上分别放置白车和黑车。在放置车的过程中，您必须确保没有两只车互相攻击。如果两只车共用同一行或同一列**，则无论颜色如何**，都会互相攻击。

有效的一步棋是将一只车放在一个位置（ $r$ ， $c$ ）上，使它不会攻击任何其他车。

你先开始，当你在自己的回合中走了一步有效的棋，将白车置于位置（ $r$ ， $c$ ）时，电脑会照搬你的棋，在它的回合中将黑车置于位置（ $c$ ， $r$ ）。如果是 $r = c$ ，那么电脑就无法映射你的棋步，并跳过它的回合。

您已经与计算机下了 $k$ 步棋（计算机也会尝试复制这些棋步），您必须继续下棋直到没有剩余的有效棋步为止。在 $k$ 步之后继续下棋时，有多少种不同的最终配置是可能的？可以保证 $k$ 步和隐含的计算机步都是有效的。由于答案可能较大，请打印出 $10^9+7$ 的模数。

如果存在一个坐标（ $r$ ， $c$ ），其中一个配置中有一个车，而另一个配置中没有，***或者***坐标上的车的颜色不同，那么这两个配置就被认为是不同的。

## 题目解析

问题不难转化成为在一个$n\times n$的空棋盘上面有多少种按要求放置棋子的方法。

由于棋子在什么位置放置不重要，这引发的一个问题就是：如果你在棋盘重点中间的某个位置放置棋子递推剩下的$n-2\times n-2$（放在非对角线位置）或者递推剩下的$n-1\times n-1$（放在对角线）局面，一定会和某个放在边缘线上的情况重合。

所以只需要按着棋盘边缘放置就可以。

这样$dp$​方程呼之欲出。
$$
dp_i=2dp_{i-2}+dp_{i-1}
$$
注意的边界条件是$dp_0=1$，根据$dp_2$的值不难得到。

## AC代码

{% spoiler "Accepted" %}

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
const int mod = 1e9 + 7;
int rem[300005];
int dp(int n)
{
    if (n < 0)
        return 0;
    if (rem[n])
        return rem[n];
    if (n == 1 || n == 0)
        return 1;
    if (n == 2)
        return 3;
    return rem[n] = (2 * (n - 1) * dp(n - 2) % mod + dp(n - 1) % mod) % mod;
}
void solve()
{
    int n, k;
    cin >> n >> k;
    int ans = n;
    for (int i = 1; i <= k; i++)
    {
        int u, v;
        cin >> u >> v;
        if (u == v)
            ans--;
        else
            ans -= 2;
    }
    cout << dp(ans) << endl;
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

{% endspoiler %}

# CF1957D A BIT of an Inequality

## 题目信息

给你一个数组 $a_1, a_2, \ldots, a_n$ 。求这样的元组 ( $x, y, z$ ) 的个数：

- $1 \leq x \leq y \leq z \leq n$ , 和
- $f(x, y) \oplus f(y, z) > f(x, z)$ .

定义 $f(l, r) = a_l \oplus a_{l + 1} \oplus \ldots \oplus a_{r}$ ，其中 $\oplus$ 表示 [bitwise XOR 运算](https://en.wikipedia.org/wiki/Bitwise_operation#XOR)。

数据保证$\sum n\leq 2\times 10^5$.

## 题目解析

现场就想到了转化成$f(x,z)\oplus a_y>f(x,z)$，但也就仅此而已了，因为***不知道如何更快地暴力区间 $[x,z]$***

首先没有想到的是，决定整个$f(x,z)\oplus a_y>f(x,z)$的是$a_y$的最高位。

因为如果最高位为$0$​，式子成立等号，不满足条件。

而如果$f(x,z)$最高位位置比$a_y$大，$a_y$不决定前面的所有位置，但是可以决定是否将$a_y$位从$1$调整成$0$​.

{% spoiler "$Tips1:$计算一个数的最高位 $1$位置的方法？" %}

是对其求 $log$​的结果。

$e.g.$ $(13)_{10}=(1101)_2,$__$lg(13)=3.$​

{% endspoiler %}

其次没有想出来的（花费最大时间思考的），如何寻找满足条件的区间数对$(x,z)$​​​?

显然，满足条件的区间应保证：

***在区间内的所有数的第 $i$位的 $1$的数量应保证为偶数。***

{% spoiler "$Tips2:$给定$n$个数，多次查询$q$，查询满足区间内异或和的结果第$k$位为$0$的区间个数。保证$n\leq 2e6$.要求$O(nlogn)$" %}

问题归结到了异或最重要的性质：
$$
if\ a\oplus b=c,then\ a\oplus c=b. 
$$
那么，设满足条件的区间为$[x,z]$，则必然有：
$$
\large a_{k_{[0,{x-1}]}}\oplus b_{k_{[x,z]}}=c_{k_{[0,z]}}\\
\large b_{k_{[x,z]}}=a_{k_{[0,x-1]}}\oplus c_{k_{[0,z]}}
$$
如果所求目标的异或和的第$k$位置结果$b_{k_[x,z]}=0$，那么其标记$[x,z]$​必然满足一下两个条件之一：

1. $a_{k_{[0,x-1]}}=1$，$c_{k_{[0,z]}}=1$.
2. $a_{k_{[0,x-1]}}=0$，$c_{k_{[0,z]}}=0$.

所以，对于查询$k$，所需的就是***整体数组异或前缀和 (含 $pre[0]$)数组第 $k$位置上为 $0(1)$的总数，然后***
$$
return\ (C_{num0}^2+C_{num_1}^2)
$$
***$num_i<2$的返回0***

{% endspoiler %}



返回题目，对于第$i$个数，找到其最高位$1$的位置$k$，查询包含第$i$个数的区间个数。对$Tips2$的算法稍作修改即可。

{% spoiler "修改在什么地方？" %}

因为要求必须含有第$i$个数，显然不能$C_{num}^2$.

枚举左右端点的个数，然后乘法原理即可。

{% endspoiler %}

## AC代码

{% spoiler "Accepted" %}

```
#include <bits/stdc++.h>
using namespace std;
#define int long long
#define IOS                      \
    ios::sync_with_stdio(false); \
    cin.tie(nullptr);            \
    cout.tie(nullptr);
void solve()
{
    int n;
    cin >> n;
    vector<int> a(n + 1);
    vector<int> sum(32);
    for (int i = 1; i <= n; i++)
    {
        cin >> a[i];
        a[i] ^= a[i - 1];
        for (int j = 31; j >= 0; j--)
        {
            sum[j] += ((a[i] >> j) & 1);
        }
    }
    vector<int> tmp(32);
    int ans = 0;
    for (int i = 1; i <= n; i++)
    {
        int tar = a[i] ^ a[i - 1];
        int k = __lg(tar);
        ans += (tmp[k] * (sum[k] - tmp[k]) + (i - tmp[k]) * (n - i + 1 - sum[k] + tmp[k]));
        for (int j = 31; j >= 0; j--)
        {
            tmp[j] += ((a[i] >> j) & 1);
        }
    }
    cout << ans << endl;
    return;
}
int32_t main()
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

{% endspoiler %}

# CF1957E Carousel of Combinations

## 题目信息

给定$n$，求以下函数表达式：
$$
\large F(n)=\sum_{i=1}^{n}\sum_{j=1}^{i}(\frac{A_i^j}{j}\ mod\ j)
$$
多组测试样例保证不多于$1e4$组，保证***每一个 $n$***均不超过$1e6$.

## 题目解析

问题在于怎么化简所求的函数式子。

$Tips1$:关于连续$j$个数对$j$的剩余系

显然，连续的$j$个整数对$j$求余的结果必然是一个$j$的完全剩余系。或言之
$$
A_i^j\equiv 0\  (mod\ j)
$$
$Tips2$:威尔逊定理
$$
\forall p, (p-1)!\equiv -1\   (mod\ p)
$$


任意连续的$j$个整数中，显然只有一个数是$j$的倍数。所以有
$$
\frac{A_i^j}{j}\equiv (j-1)!\lfloor \frac{i}{j}\rfloor \ (mod \ j)
$$
讨论$(j-1)!\ mod\ j$，注意到$j$为***除4之外的所有合数的时候，必然有***$(j-1)!\ mod\ j=0$.

因为$1\sim(j-1)$可以涵盖$j$的所有因数，除了$4$（最特殊的合数），因为$4=2\times2$，而$3!$中只有一个$2$.



那么问题就转化成了对于所有的质数和4分析。
$$
-\lfloor \frac{i}{j}\rfloor \equiv k-\lfloor \frac{i}{j}\rfloor \ (mod \ k)
$$
那么对于一个质数$j=p_k$对$S_i=\frac{A_i^j}{j}$的贡献为以下规律数列：
$$
p_k-1,\cdots,p_k-2,\cdots,2,\cdots,1,\cdots,0,\cdots,p_i-k,\cdots,p_i-k,\cdots
$$
每一个数均出现$p_i$次。



涉及到区间修改问题，采用差分前缀和维护即可。



## AC代码

{% spoiler "Accepted" %}

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
const int mod = 1e9 + 7;
const int maxn = 1e6;
vector<int> ans(maxn + 5);
vector<bool> vis(maxn + 5);
vector<int> prime;
void euler(int n)
{
    vis[1] = true;
    for (int i = 2; i <= n; i++)
    {
        if (!vis[i])
        {
            prime.push_back(i);
        }
        for (int j = 0; j < prime.size() && i * prime[j] <= n; j++)
        {
            vis[i * prime[j]] = 1;
            if (i % prime[j] == 0)
                break;
        }
    }
}
void solve()
{
    for (auto p : prime)
    {
        int cnt = p - 1;
        for (int pos = p; pos <= maxn; pos += p)
        {
            int l = pos;
            int r = min(pos + p, maxn);
            (ans[l] += cnt) %= mod;
            if (r == pos + p)
            {
                ans[r] = (ans[r] - cnt + mod) % mod;
            }
            cnt = (p + cnt - 1) % p;
        }
    }
    int calc = 1;
    for (int pos = 4; pos <= maxn; pos += 4, calc++)
    {
        int l = pos;
        int r = min(pos + 4, maxn);
        (ans[l] += (calc & 1) * 2) %= mod;
        if (r == pos + 4)
        {
            ans[r] = (ans[r] - (calc & 1) * 2 + mod) % mod;
        }
    }
    for (int i = 1; i <= maxn; i++)
    {
        (ans[i] += ans[i - 1]) %= mod;
    }
    for (int i = 1; i <= maxn; i++)
    {
        (ans[i] += ans[i - 1]) %= mod;
    }
    return;
}
signed main()
{
    IOS;
    int t;
    cin >> t;
    euler(maxn);
    solve();
    while (t--)
    {
        int n;
        cin >> n;
        cout << ans[n] << endl;
    }
    system("pause");
    return 0;
}
```

{% endspoiler %}

