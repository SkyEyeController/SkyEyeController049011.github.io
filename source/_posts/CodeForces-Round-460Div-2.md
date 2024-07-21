---
title: CodeForces Round 460Div.2
tags:
  - codeforces
  - C++
categories:
  - ICPC-CCPC
mathjax: true
abbrlink: 46848bf1
date: 2024-05-02 21:05:28
---

古董场。唐完了

数论（费马小定理+$CRT$)；图论（拓补序$dp$​​）.

<!--more-->

# CF919B Perfect Number

#### 题目信息

当且仅当一个正整数的数位之和恰好是 $10$ 时，我们才认为它是完全正整数。给定一个正整数 $k$ ，你的任务是找出 $k$ -th 最小的完美正整数。

保证$k\le 10^4$.

#### 题目解析

可以回忆一下[$ARC173A\ Neq\ Number$](https://atcoder.jp/contests/arc173/tasks/arc173_a)

同样的两种题以及大相径庭的处理方法。当然，$ARC$的范围肯定不支持暴力解法。

本题暴力打表枚举发现上限才$1e7$，枚举就行。

使用$dfs$暴力找一万个的时候需注意，$1900$的情况也需要考虑，所以不能在数位满足$10$后直接退出不再继续深搜。

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
vector<int> ans;
string t;
void dfs(int i, int sum)
{
    if (i == 10)
    {
        return;
    }
    if (sum == 10)
    {
        istringstream ss(t);
        int num;
        ss >> num;
        if (num)
            ans.push_back(num);
        t += '0';
        dfs(i + 1, sum);
        t.erase(prev(t.end()));
        return;
    }
    for (int j = 0; j + sum <= 10; j++)
    {
        if (i == 0 && j == 0)
            continue;
        t += char(j + '0');
        dfs(i + 1, sum + j);
        t.erase(prev(t.end()));
    }
    return;
}
void solve()
{
    int k;
    cin >> k;
    cout << ans[k - 1] << endl;
    return;
}
signed main()
{
    IOS;
    dfs(0, 0);
    sort(ans.begin(), ans.end());
    //cout << ans.size() << endl;
    int t;
    t = 1;
    while (t--)
    {
        solve();
    }
    system("pause");
    return 0;
}
```

# CF919C  Seat Arrangements

#### 题目信息

假设你在一所校园里，每天都要去上课。你可能会看到，当你匆匆赶到教室时，你会惊讶地发现那里有很多座位已经被占了。今天，你和朋友去上课，发现有些座位已经被占了。

教室里有 $n$ 排座位，每排有 $m$ 个座位。那么教室可以表示为一个 $n \times m$ 矩阵。字符'.'表示空座位，而'\*'表示该座位有人。你需要在同一行或同一列中找到 $k$ 个连续的空座位，并为你和你的朋友安排这些座位。您的任务是找出排列座位的方法数。**如果学生所占位置的集合不同，则认为两种方法不同**。

#### 题目解析

横着竖着爆搜就行。爆搜时维护区间和。

注意$k=1$情况特判。

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
    int n, m, k;
    int ansfinal = 0;
    cin >> n >> m >> k;
    vector<string> ans(n);
    for (auto &p : ans)
        cin >> p;
    if (m >= k)
        for (int i = 0; i < n; i++)
        {
            int tmp = 0;
            for (int l = 0; l < k; l++)
            {
                tmp += (ans[i][l] == '*');
            }
            if (!tmp)
                ansfinal++;
            for (int j = k; j < m; j++)
            {
                tmp += (ans[i][j] == '*') - (ans[i][j - k] == '*');
                if (!tmp)
                    ansfinal++;
            }
        }

    if (n >= k)
        for (int j = 0; j < m; j++)
        {
            int tmp = 0;
            for (int l = 0; l < k; l++)
            {
                tmp += (ans[l][j] == '*');
            }
            if (!tmp)
                ansfinal++;
            for (int i = k; i < n; i++)
            {
                tmp += (ans[i][j] == '*') - (ans[i - k][j] == '*');
                if (!tmp)
                    ansfinal++;
            }
        }
    if (k == 1)
        ansfinal /= 2;
    cout << ansfinal << endl;
    return;
}
signed main()
{
    IOS;
    int t;
    // cin >> t;
    t = 1;
    while (t--)
    {
        solve();
    }
    system("pause");
    return 0;
}
```

# CF919D Substring

#### 题目信息

[Problem - D - Codeforces](https://codeforces.com/contest/919/problem/D)

给你一个有 $n$ 个节点和 $m$ 条**定向**边的图。每个节点分配一个小写字母。我们将路径的值定义为出现频率最高的字母的编号。例如，如果一条路径上的字母是 "abaca"，那么这条路径的值就是 $3$ 。你的任务是找出一条值最大的路径。

**输入**

第一行包含两个正整数 $n, m$ ( $1 \leq n, m \leq 300\,000$ ) ，表示图中有 $n$ 个节点和 $m$ 条有向边。

第二行包含一个只有小写英文字母的字符串 $s$ 。第 $i$ 个字符是分配给第 $i$ 个节点的字母。

然后是 $m$ 行。每行包含两个整数 $x, y$ ( $1 \leq x, y \leq n$ )，描述了从 $x$ 到 $y$ 的有向边。请注意， $x$ 可以等于 $y$ ， $x$ 和 $y$​ 之间可以有多条边。此外，图形也可能是不相连的。

**输出**

输出一行表示最大值的整数。如果数值可以任意大，则输出 $-1$ 代替。

#### 题目解析

显然图必须无环，否则任意大。

接下来考虑任意一个节点$u$.其经过$u$必然是从上游传入，并从自己传出。

$DAG$，顺序相关，考虑拓补序。显然，$u$结尾的最优解来源于$u$的上游。同时注意所求的最大贡献是不可累加的，所以需要分别对应字母单独维护。

设$dp[i][j]$表示以$u$结尾字母$j$出现的最多次数。那么显然有
$$
\large dp[i][j]=max(dp[u][j]+[s[i]==j],dp[i][j])
$$
初始值$dp[i][s[i]]=1$，其余均为$0$.

顺着拓补序转移就行。如果拓补访问节点总数不是$n$就证明有环。

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
const int maxn = 3e5 + 1;
vector<int> connects[maxn];
int indegree[maxn];
void add_edge(int u, int v)
{
    connects[u].push_back(v);
    indegree[v]++;
    return;
}
int dp[maxn][26];
void solve()
{
    int n, m;
    cin >> n >> m;
    string s;
    cin >> s;
    for (int i = 1; i <= m; i++)
    {
        int u, v;
        cin >> u >> v;
        add_edge(u, v);
    }
    int cnt = 0;
    queue<int> q;
    for (int i = 0; i < n; i++)
    {
        dp[i + 1][s[i] - 'a']++;
        if (!indegree[i + 1])
            q.push(i + 1);
    }
    int finalans = -1;
    while (!q.empty())
    {
        int pos = q.front();
        q.pop();
        cnt++;
        if (connects[pos].empty())
        {
            for (int i = 0; i <= 25; i++)
            {
                finalans = max(finalans, dp[pos][i]);
            }
            continue;
        }
        for (auto v : connects[pos])
        {
            for (int i = 0; i <= 25; i++)
            {
                dp[v][i] = max(dp[v][i], dp[pos][i] + ((s[v - 1] - 'a') == i));
            }
            indegree[v]--;
            if (!indegree[v])
                q.push(v);
        }
    }
    if (cnt != n)
    {
        cout << -1 << endl;
    }
    else
    {
        cout << finalans << endl;
    }

    return;
}
signed main()
{
    IOS;
    int t;
    // cin >> t;
    t = 1;
    while (t--)
    {
        solve();
    }
    system("pause");
    return 0;
}
```

# CF919E Congruence Equation

#### 题目信息

[Problem - E - Codeforces](https://codeforces.com/contest/919/problem/E)

给定一个整数 $x$ 。你的任务是找出有多少个正整数 $n$ ( $1 \leq n \leq x$ ) 满足这个条件。( $1 \leq n \leq x$ ) 满足

$$
n \cdot a^n \equiv b \quad (\textrm{mod}\;p)
$$
 其中 $a, b, p$ 是所有已知常数。

**输入**

唯一一行包含四个整数 $a,b,p,x$ （ $2 \leq p \leq 10^6+3$ 、 $1 \leq a,b < p$ 、 $1 \leq x \leq 10^{12}$ ）。( $2 \leq p \leq 10^6+3$ , $1 \leq a,b < p$ , $1 \leq x \leq 10^{12}$ ).保证 $p$​ 是质数。

**输出**

打印一个整数：可能的答案数 $n$ 。

#### 题目解析

数论好题。

不难想到有费马小定理：
$$
n\cdot a^{n\ mod \ (p-1)}\equiv b\  (mod\ p)
$$
考虑给定的$p$是$1e6$的，而且指数上$n\ mod \ (p-1)$完全系最多$p-1$个元素，考虑枚举$q\in\left\{0,1,\ldots,p-2\right\}$，则有以下等式：
$$
\left\{
\begin{aligned}
&n=sp+b\cdot a^{-q}\\
\\
&n=k(p-1)+q
\end{aligned}
\right.
$$
更进一步的有：
$$
\left\{
\begin{aligned}
&n\equiv b\cdot a^{-q} \quad mod\ p\\
\\
&n\equiv q \quad \quad \quad\  mod\ (p-1)\\
\end{aligned}
\right.
$$
显然$p$和$p-1$互质，中国剩余定理$CRT$求出最小解，计算倍数即可。



> ***中国剩余定理$CRT$***
>
> 求解如下线性同余方程组
>$$
> \left\{\begin{aligned}
> &x\equiv a_1\ (mod\ n_1)\\
> &x\equiv a_2\ (mod\ n_2)\\
> &\quad\vdots\\
> &x\equiv a_k\ (mod\ n_k)\\
> \end{aligned}\right.
> $$
> 
> 
>其中所有$n_i$互质。
>
> **求解过程**
>
> 1. 计算$N=\prod_{i=1}^kn_i$
>2. 对于第$i$个方程:
>    1. 计算$m_i=\frac{N}{n_i}$
>    2. 计算$m_i^{-1}\ (mod\ n_i)$
>    3. 计算$c_i=m_i\cdot m_i^{-1}$，对$N$取模。
> 3. 方程组在模$n$意义下唯一解为$x=\sum_{i=1}^k(a_i\cdot c_i \ mod \ N)$
> 

```
#include <bits/stdc++.h>
using namespace std;
#define int long long
#define IOS                      \
    ios::sync_with_stdio(false); \
    cin.tie(0);                  \
    cout.tie(0);
int quickpow(int a, int b, int mod)
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
int quickinv(int a, int mod)
{
    return quickpow(a, mod - 2, mod);
}
int a, b, x, p;
void Exgcd(int a, int b, int &x, int &y)
{
    if (!b)
    {
        x = 1, y = 0;
        return;
    }
    Exgcd(b, a % b, y, x);
    y -= (a / b) * x;
    return;
}
int inv(int a, int mod)
{
    int x, y;
    Exgcd(a, mod, x, y);
    return (x + mod) % mod;
}
int CRT(int a, int b)
{
    int N = p * (p - 1);
    return (a * p % N * inv(p, p - 1) % N + b * (p - 1) % N * inv(p - 1, p) % N) % N;
}
void solve()
{
    cin >> a >> b >> p >> x;
    int ans = 0;
    for (int q = 0; q <= p - 2; q++)
    {
        int t = (b % p * quickinv(quickpow(a, q, p), p)) % p;
        int crt = CRT(q, t);
        if (x >= crt)
            ans += (x - crt) / (p * (p - 1)) + 1;
    }
    cout << ans << endl;
    return;
}
signed main()
{
    IOS;
    int t;
    t = 1;
    while (t--)
        solve();
    return 0;
}
```

