---
title: Codeforces Educational Round 165 Div.2
tags:
  - codeforces
  - C++
categories:
  - ICPC-CCPC
mathjax: true
abbrlink: b0fa6333
date: 2024-05-01 19:52:54
---

被$C$​​卡了

杂交场，啥都有，$dp$、扫描线、贪心博弈论

<!--more-->

# CF1969C Minimizing the Sum

#### 题目信息

[Problem - C - Codeforces](https://codeforces.com/contest/1969/problem/C)

给你一个长度为 $n$ 的整数数组 $a$ 。

你可以执行以下操作：选择数组中的一个元素，并用其邻近元素的值替换它。

例如，如果是 $a=[3, 1, 2]$ ，你可以通过一次操作得到数组 $[3, 3, 2]$ 、 $[3, 2, 2]$ 和 $[1, 1, 2]$ 中的一个，但不能得到 $[2, 1, 2 ]$ 或 $[3, 4, 2]$ 。

你的任务是计算数组的最小总和，如果你能执行上述操作最多 $k$​​ 次的话。

**输入**

第一行包含一个整数 $t$ （ $1 \le t \le 10^4$ ）。( $1 \le t \le 10^4$ ) - 测试用例的数量。

每个测试用例的第一行包含两个整数 $n$ 和 $k$ （ $1 \le n \le 3 \cdot 10^5$ ; $0 \le k \le 10$ ）。

第二行包含 $n$ 个整数 $a_1, a_2, \dots, a_n$ ( $1 \le a_i \le 10^9$ )。

输入的附加限制：所有测试用例中 $n$ 的总和不超过 $3 \cdot 10^5$ 。

#### 题目解析

注意数据范围。

区间$dp$。一开始的时候想的是直接暴力每次找到当前下降率最大的然后修改，但是$AmiyaCast$指出了我自己样例的一个错误：

```
1
3 2
1 2 500
```

这个结果应该是`3`，全部换成`1`.而如果$k$次暴力更换，得到的结果应当是$4$。因为贪心的换会忽视先换成`1 1 500`的更优情况。

到这里就不难想到应当是优先考虑去用目标区间最小的值传染。故考虑区间$dp$.

设$dp[i][j]$表示以$i$为结尾操作了$j$次所能得到的最小值。显然有

$$
\Large dp[i][j]=\mathop{\min}\limits_{j\in[1,k]}(dp[i-j-1]+op(i-j,i)\times(j+1))
$$
$ST+dp$维护即可。区间$dp$核心在于只考虑区间的最后一部分可能造成的影响。建议回忆[$CF939Div.2$](https://codeforces.com/contest/1956/problem/D)

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
const int mod = 998244353;
const int maxn = 3e5 + 1;
int st[maxn][21];
int dp[maxn][21];
int lg[maxn];
int check(int l, int r)
{
    return min(st[l][(lg[r - l + 1])], st[r - (1LL << lg[r - l + 1]) + 1][lg[r - l + 1]]);
}
void solve()
{
    int n, k;
    cin >> n >> k;
    for (int i = 1; i <= n; i++)
        cin >> st[i][0];
    for (int j = 1; j <= 21; j++)
    {
        for (int i = 1; i + (1LL << j) - 1 <= n; i++)
        {
            st[i][j] = min(st[i][j - 1], st[i + (1LL << (j - 1))][j - 1]);
        }
    }
    for (int i = 0; i <= n; i++)
    {
        for (int j = 0; j <= k; j++)
        {
            dp[i][j] = INF;
        }
    }
    dp[0][0] = 0;
    for (int i = 1; i <= n; i++)
        for (int j = 0; j <= k; j++)
        {
            for (int t = 0; t <= j; t++)
            {
                if (i - t - 1 >= 0)
                    dp[i][j] = min(dp[i][j], dp[i - t - 1][j - t] + check(i - t, i) * (t + 1));
            }
        }
    int ans = INF;
    cout << dp[n][min(k, n - 1)] << endl;
    return;
}
signed main()
{
    IOS;
    for (int i = 2; i <= maxn; i++)
    {
        lg[i] = lg[i >> 1LL] + 1;
    }
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

# CF1969D Shop Game

#### 题目信息

[Problem - D - Codeforces](https://codeforces.com/contest/1969/problem/D)

爱丽丝和鲍勃正在商店里玩游戏。商店里有 $n$ 件商品；每件商品有两个参数： $a_i$ （爱丽丝的物品价格）和 $b_i$ （鲍勃的物品价格）。

爱丽丝希望选择一个商品子集（可能是空）并购买它们。之后，Bob 会执行以下操作：

- 如果爱丽丝购买的物品少于 $k$ ，鲍勃可以免费拿走所有物品；
- 否则，他将免费拿走爱丽丝购买的 $k$ 件（由鲍勃选择是哪一个 $k$ 件），至于其他所选物品，鲍勃将从爱丽丝处购买，并为 $i$ \-th 件支付 $b_i$ 的费用。

爱丽丝的利润等于 $\sum\limits_{i \in S} b_i - \sum\limits_{j \in T} a_j$ ，其中 $S$ 是鲍勃从爱丽丝处购买的物品集， $T$ 是爱丽丝从商店购买的物品集。换句话说，爱丽丝的利润就是鲍勃支付给她的金额和她购买商品所花费的金额之间的差额。

爱丽丝希望自己的利润最大化，而鲍勃希望爱丽丝的利润最小化。您的任务是计算在爱丽丝和鲍勃都采取最优行动的情况下爱丽丝的利润。

#### 题目解析

优先从后手角度开始思考。

对于$Alice$已经进的货，$Bob$想要她赚的更少，必然是优先挑大的零元购。剩下的付钱。

那么$Alice$想要反制$Bob$，就必须保证自己会被零元购的商品的进货价更小，剩下的部分的出售价还要尽可能的大。

所以$Alice$将所有商店内的商品按照售货价第一关键字从大到小，进货价第二关键字从小到大排序，然后先拿出来$k$件迫使$Bob$零元购，再买$j$件能盈利的商品迫使$Bob$​付钱回本。显然，盈利的时候要能盈利的全都进货。

计算时，以盈利商品的界限进行划分讨论。对于界限$i$，$i+1\sim n$是要让$Bob$付费的选择区间；$1\sim i$是迫使$Bob$零元购的区间。在维护$Bob$零元购的物品集合的时候，如果集合大小大于$k$​，我们从集合中删除进货价最高的那一个并用下一个进行替换。

{% spoiler "Accepted" %}

```
#include<iostream>
#include<cstring>
#include<vector>
#include<set>
#include<numeric>
#include<algorithm>
using namespace std;
using LL = long long;

int main(){
    cin.tie(0);
    cout.tie(0);
    ios::sync_with_stdio(0);
    int T;
    cin >> T;
    while(T--){
        int n, k;
        cin >> n >> k;
        vector<int> a(n), b(n);
        for(int i = 0; i < n; i++) cin >> a[i];
        for(int i = 0; i < n; i++) cin >> b[i];
        vector<int> id(n);
        iota(id.begin(), id.end(), 0);
        sort(id.begin(), id.end(), [&](int x, int y){
            if (b[x] != b[y]) return b[x] > b[y];
            return a[x] < a[y];
        });
        LL s1 = 0, s2 = 0, ans = 0;
        set<pair<int, int> > s;
        for(int i = 0; i < k; i++){
            s.insert({a[id[i]], id[i]});
            s1 += a[id[i]];
        }
        for(int i = k; i < n; i++){
            if (b[id[i]] > a[id[i]]){
                s2 += b[id[i]] - a[id[i]];
            }
        }
        for(int i = k; i < n; i++){
            ans = max(ans, s2 - s1);
            if (b[id[i]] > a[id[i]]){
                s2 -= b[id[i]] - a[id[i]];
            }
            s.insert({a[id[i]], id[i]});
            s1 += a[id[i]];
            s1 -= prev(s.end())->first;
            s.erase(prev(s.end()));
        }
        cout << ans << '\n';
    }

}
```

{% endspoiler %}

## CF1969E  Unique Array

#### 题目信息

[Problem - E - Codeforces](https://codeforces.com/contest/1969/problem/E)

给你一个长度为 $n$ 的整数数组 $a$ 。 $a$ 的子数组是其连续的子序列之一（即数组 $[a_l, a_{l+1}, \dots, a_r]$ 中的某个整数 $l$ 和 $r$ ，使得 $1 \le l < r \le n$ ）。如果有一个整数在子数组中恰好出现一次，那么这个子数组就是唯一的。

您可以执行以下任意次数（可能为零）的操作：从数组中选择一个元素，然后用任意整数替换它。

你的任务是计算上述操作的最少次数，以使数组 $a$​ 的所有子数组都是唯一的。

**输入**

第一行包含一个整数 $t$ ( $1 \le t \le 10^4$ ) - 测试用例数。

每个测试用例的第一行包含一个整数 $n$ ( $1 \le n \le 3 \cdot 10^5$ )。

第二行包含 $n$ 个整数 $a_1, a_2, \dots, a_n$ ( $1 \le a_i \le n$ )。

输入的附加限制：所有测试用例中 $n$ 的总和不超过 $3 \cdot 10^5$ 。

#### 题目解析

$ABC346G-Alone$几乎原题，只是最后的计算细节变了变。

显然换数要换在序列里从来都没出现过的。

扫描线乱搞，当扫到第$i$目标层（高度$p_i$）没有盖满点，总结果加一：修改$a_{p_i}$为任意未在序列中出现过的数。

上述修改能保证必然将$[1,a_{p_i}]\times[a_{p_i},n]$加入到扫描线集合中，保证能将对应层盖满且是最优解。

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
const int mod = 998244353;
const int maxn = 3e5 + 1;
int n;
typedef struct node
{
    int sum = 0;
    int times = 0;
    int l, r;
} node;
node tree[maxn << (2LL)];
void push_up(int p)
{
    if (tree[p].times)
    {
        tree[p].sum = tree[p].r - tree[p].l + 1;
    }
    else
    {
        if (tree[p].l == tree[p].r)
        {
            tree[p].sum = 0;
            return;
        }
        tree[p].sum = tree[p << 1LL].sum + tree[p << 1LL | 1LL].sum;
    }
    return;
}
void build(int cl = 1, int cr = n, int p = 1)
{
    tree[p].l = cl;
    tree[p].r = cr;
    if (cl == cr)
    {
        tree[p].times = 0;
        tree[p].sum = 0;
        return;
    }
    int mid = (cl + cr) >> 1LL;
    build(cl, mid, p << 1LL);
    build(mid + 1, cr, p << 1LL | 1LL);
}

void modify(int l, int r, int d, int cl = 1, int cr = n, int p = 1)
{
    if (l > r || cr < l || cl > r)
    {
        return;
    }
    if (l <= cl && cr <= r)
    {
        tree[p].times += d;
        push_up(p);
        return;
    }
    int mid = (cl + cr) >> 1LL;
    modify(l, r, d, cl, mid, p << 1LL);
    modify(l, r, d, mid + 1, cr, p << 1LL | 1LL);
    push_up(p);
    return;
}
vector<pair<int, pair<p, int>>> op;
struct rem
{
    int num;
    int lpos = 0, rpos = n + 1;
};
vector<rem> a;
vector<int> pre;
void solve()
{
    cin >> n;
    a = vector<rem>(n + 1);
    pre = vector<int>(n + 1, 0);
    op.clear();
    for (int i = 1; i <= n; i++)
    {
        cin >> a[i].num;
        a[i].lpos = pre[a[i].num];
        if (pre[a[i].num])
        {
            a[pre[a[i].num]].rpos = i;
        }
        pre[a[i].num] = i;
    }
    for (int i = 1; i <= n; i++)
    {
        op.push_back({i, { {a[i].lpos + 1, i }, 1} });
        op.push_back({a[i].rpos, { {a[i].lpos + 1, i}, -1} });
    }
    sort(op.begin(), op.end());
    build();
    int ans = 0;
    vector<p> rem;
    int h = (*op.begin()).first;
    for (int i = 0; i < op.size(); i++)
    {
        if (op[i].first != h)
        {
            if (tree[1].sum != h)
            {
                ans++;
                modify(1, h, 1);
                op.push_back({n + 1, { {1, h}, -1} });
            }
            h = op[i].first;
        }
        modify(op[i].second.first.first, op[i].second.first.second, op[i].second.second);
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

{% endspoiler %}

