---
title: 2324TJUACM集训第二讲——数据结构
tags:
  - 程序设计
  - C++
categories:
  - ICPC-CCPC
abbrlink: 80f18e2f
mathjax: true
date: 2024-01-15 21:24:17
---

主要记录一下掌握不太熟练的数据结构，分析ST表，树状数组，线段树，并查集以及堆

群英荟萃的第二天。

<!--more-->

# DA-1 并查集

## 1-1 普通并查集
普通并查集的废话不多说，讲一个按秩压缩的路径问题。

一般的而言，在$getfather()$函数中会采用路径压缩的方式来降低父亲访问复杂度，但是路径压缩只在访问父亲的时候发生，并且只是单路径的优化，无法实现最有效果的菊花图。

那么如果只有路径压缩的话，如果已经存在了一颗简单的并查集树，我又有了一颗简单树，两个数的根节点存在父亲关系，那么此时如果将复杂的树像简单的树合并，就会造成可能的大面积的重新的路径压缩（最坏情况下复杂树上的所有点都需要重新压一遍）。而如果将简单树向复杂树合并，做可能出现的最坏代价会更小一些，承受度更大一些。而区分树的复杂程度是通过树的高度来体现的，一说树的秩。

<img src="Da-1-1.png" alt="按秩压缩的原因" style="zoom:80%;" />

按秩压缩的代码与正常的路径压缩的差异仅在初始化和合并的时候体现。

初始化
```
void init(int n)
{
    for(int i=1;i<=n;i++)
    {
        father[i]=i;
        ran[i]=0;//1也行，无所谓，注意不要命名为rank，C++17以上出现歧义
    }
}
```
合并
```
void merge(int x,int y)
{
    int fx=getfather(x);
    int fy=getfather(y);
    if(fx==fy)return;
    if(rank[fx]<=rank[fy])
    {
        father[fx]=fy;
        if(rank[fx]==rank[fy]&&x!yy)rank[fy]++;
    }
    else father[fy]=fx;
    return;
}
```

需要注意一点的是，如果并查集的关系是一个单向的偏序关系，就不能用路径压缩了，因为关系的指向性唯一，必须遵从这个方向合并。如果涉及偏序关系的题目出现了$TLE$现象，不从这里考虑时间优化([$POJ-1182$ 食物链](http://poj.org/problem?id=1182),$POJ$日常卡cin)

## 1-2 种类并查集

继续就食物链的题开始，当存在闭环式的偏序关系时（即若A和B有偏序关系，B和C有偏序关系，那么C和A有偏序关系，以此类推，可以使用种类并查集维护关系）

对于大小为$N$的偏序关系环作用于基数大小为$M$的人群的时候，我们可以开一个$N\times M$的并查集一维数组，区间$[(i-1)\times M+1,i\times M]$维护的是第$i$个偏序关系作用域，各区域之间等价。

维护同类相吸关系时，在各自区域内实现并查集合并。

维护异类相斥关系的时候，进行相邻区域之间跨区域并查集合并，由于各区间之间等价，你需要把所有的区间都执行一遍操作。

```
if x-y同类关系
then for i=1 -> N merge((i-1)*M+x,(i-1)*M+y)
//merge(x,y);merge(x+M,y+M);……

if x-y异类关系
then for i=1 -> N merge((i-1)*M+x,(i%N)*M+y)
//merge(x,y+M);merge(x+M,y+2*M),……,merge(x+M*(N-1),y);
//注意倒回去回转，最后一组指向第一组

```

但是检查关系的时候，只需要检查前两组都行（因为全员等价）

[$POJ-1182$ 食物链](http://poj.org/problem?id=1182)
```
#include <iostream>
#include <cstdlib>
#include <cstdio>
using namespace std;
const int maxn = 1e6 + 1;
int father[maxn];
int ran[maxn];
int n;
int getfather(int x)
{
    if (x == father[x])
        return x;
    return father[x] = getfather(father[x]);
}
void merge(int x, int y)
{
    int fx = getfather(x);
    int fy = getfather(y);
    if (fx == fy)
        return;
    /* if (ran[fx] <= ran[fy])
     {
         father[fx] = fy;
         if (ran[fx] == ran[fy])
             ran[fy]++;
     }
     else
     {
         father[fx] = fy;
     }
     */
    father[fx]=fy;
    return;
}
void eat(int x, int y)
{
    merge(x, n + y);
    merge(n + x, 2 * n + y);
    merge(2 * n + x, y);
}
void same(int x, int y)
{
    merge(x, y);
    merge(n + x, n + y);
    merge(2 * n + x, 2 * n + y);
}
bool checkeat(int x, int y)
{
    return getfather(x) == getfather(y + n) || getfather(x) == getfather(y + 2 * n); // 查询捕食和被捕食关系
}
bool checksame(int x, int y)
{
    return (getfather(x) == getfather(y)) || x == y;
}
void init(int n)
{
    for (int i = 1; i <= 3 * n; i++)
    {
        father[i] = i;
    }
}
int main()
{
    scanf("%d", &n);
    init(n);
    int t;
    scanf("%d", &t);
    int cnt = 0;
    while (t--)
    {
        int a, b, c;
        scanf("%d%d%d", &a, &b, &c);
        if (b > n || c > n || (a == 2 && b == c))
        {
            cnt++;
            continue;
        }
        if (a == 1)
        {
            if (getfather(b) == getfather(c + n) || getfather(b) == getfather(c + 2 * n))
                cnt++;
            else
                same(b, c);
        }
        if (a == 2)
        {
            if (getfather(b) == getfather(c) || getfather(b) == getfather(c + 2 * n))
                cnt++;
            else
                eat(b, c);
        }
    }
    printf("%d", cnt);
    system("pause");
    return 0;
}
```
## 1-3 带权并查集

种类并查集优点在于容易理解且直观表现，但是当关系过于庞大复杂或者出现连续的分段区间重合合并成大区间时，就无用武之地了。此时，带权并查集可以非常优美的解决这些问题。

带权并查集的核心维护的是从x到其父亲节点的向量信息，表示x指向父亲的一段关系，可以是捕食、被捕食、同类，也可以表示区间和的奇偶性、区间和的总值等等。

需要注意的是，带权并查集路径压缩的时候需要先记录当前的最近father，再状态压缩，因为权值加的时候需要加临近的father的权值。

$val[x]$初始时为0（指向自己）
```
int getfather(int x)
{
    if(x==father[x])
    {
        return x;
    }
    int fa=father[x];
    father[x]=getfather(father[x]);
    val[x]=(val[x]+val[fa]);
    return father[x];
}
```

<img src="Da-1-3.png" alt="压缩" style="zoom:80%;" />

合并操作
```
void merge(int x,int y,int val)
{
    int fx=getfather(x);
    int fy=getfather(y);
    if(fx!=fy)
    {
        father[fx]=fy;
        val[fx]=(value+val[y]-val[x]);//画图理解
    }
}
```

<img src="Da-1-4.png" alt="合并，蓝色向量为辅助" style="zoom:80%;" />

权值查询
```
bool query(int x,int y)
{
    return val[x]-val[y];
}
```

<img src="Da-1-5.png" alt="权值询问" style="zoom:80%;" />

[$POJ-1182$ 食物链](http://poj.org/problem?id=1182)

经典带权并查集描述种类替代种类并查集，注意带模减法需要多加一个MOD保证正数。

0表示同族，1表示捕食，2表示天敌。
```
#include <iostream>
#include <cstdio>
#include <cstdlib>
using namespace std;
const int maxn = 2e5;
int father[maxn];
int val[maxn];
void init(int n)
{
    for (int i = 1; i <= n; i++)
    {
        father[i] = i;
    }
    return;
}
int getfather(int x)
{
    int fa = father[x];
    if (x != father[x])
    {
        father[x] = getfather(father[x]);
        val[x] = (val[x] + val[fa]) % 3;
        return father[x];
    }
    return x;
}
void merge(int x, int y, int value)
{
    int fx = getfather(x);
    int fy = getfather(y);
    father[fx] = fy;
    val[fx] = (3 + value + val[y] - val[x]) % 3;
}
int main()
{
    int n;
    scanf("%d", &n);
    init(n);
    int t;
    scanf("%d", &t);
    int cnt = 0;
    for (int i = 1; i <= t; i++)
    {
        int a, b, c;
        scanf("%d%d%d", &a, &b, &c);
        if ((b > n || c > n) || (a == 2 && b == c))
        {
            cnt++;
            continue;
        }
        int f1 = getfather(b), f2 = getfather(c);
        if (a == 1)
        {
            if (f1 == f2 && val[b] != val[c])
            {
                cnt++;
                continue;
            }
            else if (f1 != f2)
            {
                father[f1] = f2;
                val[f1] = (3 + val[c] - val[b]) % 3;
            }
        }
        if (a == 2)
        {
            if (f1 == f2 && (3 + val[b] - val[c]) % 3 != 1)
            {
                cnt++;
                continue;
            }
            else if (f1 != f2)
            {
                father[f1] = f2;
                val[f1] = (4 + val[c] - val[b]) % 3;
            }
        }
    }

    printf("%d", cnt);
    system("pause");
    return 0;
}
```
[$POJ-1733$ Parity game](http://poj.org/problem?id=1733)

带权维护连续区间性质

```
#include<cstdio>
#include<map>
#include<set>
#include<cstdlib>
using namespace std;
#define int long long
map<int, int> father;
map<int, int> val;
int getfather(int x)
{
    int fa = father[x];
    if (x == father[x])
        return father[x];
    father[x] = getfather(father[x]);
    val[x] = (val[x] + val[fa]) % 2;
    return father[x];
}
void merge(int x, int y, int value)
{
    int fx = getfather(x);
    int fy = getfather(y);
    if (fx == fy)
        return;
    father[fx] = fy;
    val[fx] = (value + val[y] - val[x] + 2) % 2;
}
signed main()
{
    int t, n;
    scanf("%lld%lld", &t, &n);
    int i = 1;
    bool tag = 1;
    int j = n;
    for (i = 1; i <= n; i++)
    {
        int a, b;
        char c[5];
        scanf("%lld%lld%s", &a, &b, &c);
        if (!tag)
            continue;
        b++;
        if (!father[a])
            father[a] = a, val[a] = 0;
        if (!father[b])
            father[b] = b, val[b] = 0;
        int value = (c[0] == 'e' ? 0 : 1);
        int fa = getfather(a), fb = getfather(b);
        if (fa != fb)
        {
            father[fa] = fb;
            val[fa] = (value + 2 + val[b] - val[a]) % 2;
        }
        else
        {
            if ((val[a] - val[b] + 2) % 2 != value)
            {
                tag = 0;
                j = i - 1;
            }
        }
    }
    printf("%lld\n", j);
    system("pause");
    return 0;
}
```
[$POJ-1988$ Cube Stacking](http://poj.org/problem?id=1988)

中文题面

约翰和贝茜在玩一个方块游戏。编号为 $ 1\ldots n $ 的 $ n $ ( $ 1 \leq n \leq 30000 $ )个方块正放在地上，每个构成一个立方柱。

游戏开始后，约翰会给贝茜发出 $ P $ ( $ 1 \leq P \leq 100000 $ )个指令。指令有两种：

1. 移动（M）：将包含 X 的立方柱移动到包含 Y 的立方柱上。
2. 统计（C）：统计含 X 的立方柱中，在 X 下方的方块数目。

写个程序帮贝茜完成游戏。

属实是带权并查集的板子题目了，X直接指向Y表示合并（此时父亲为最底下的一个节点），中途权值维护，自己下面的总和$fa.down$（不含自己）。

状态压缩的时候，$$fa.up=x.up\qquad fa.down+getfather(fa).down=x.down$$


节点合并的时候，$X$向$Y$合并，这是需要用到以X为最底的元素堆有多少个元素（含自己）

$$
faX.down+=num[faY]\qquad 
num[faY]+=num[faX];
$$

```
#include<cstdio>
#include<cmath>
#include<iostream>
#define N 30005
using namespace std;
int t;
int f[N],pre[N],num[N];
int find(int x)
{
	if(x==f[x])
		return x;
	int fx=find(f[x]);
	pre[x]+=pre[f[x]];
	return f[x]=fx;
}

int main()
{
	scanf("%d",&t);
	for(int i=1;i<=N;i++)
    {
		f[i]=i;
		num[i]=1;
	}
	char opt;
	int x,y;
	for(int i=1;i<=t;i++)
    {
		scanf(" %c%d",&opt,&x);
		int fx=find(x);
		if(opt=='M')
        {
			scanf("%d",&y);
			int fy=find(y);
			f[fx]=fy;
			pre[fx]+=num[fy];
			num[fy]+=num[fx];
			num[fx]=0;

		}
		else printf("%d\n",pre[x]); 
	}
	return 0;
}
```
# Da-2 树状数组

适用于单点修改和区间查询的问题，要求是维护的性质和运算必须和维护集合构成$Abel$群（运算封闭，运算可结合，运算有幺元，运算有逆元），像$max$等性质无法高效率维护，评价是不如线段树。

```
#define lowbit(x) x&-x
const int N=maxn<<1;
int tree[N];
void add(int i,int x)
{
    for(int pos=i;pos<=N;pos+=lowbit(pos))tree[pos]+=x;
}
int sum(int x)
{
    int ans=0;
    for(int pos=x;pos;pos-=lowbit(pos))ans+=tree[pos];
    return ans;
}
int query(int l,int r)
{
    return sum(r)-sum(l-1);
}
```
重点提一嘴权值树状数组的应用

$a[i]$的权值数组$b[i]$是$i$在$a[i]$中出现的次数，例如
$$
a_n= \left( 1,2,3,3,5 \right) \qquad b_m=\left(1,1,2,0,1\right)
$$

很明显，$b$ 的大小和 $a$ 的值域有关。

若原数列值域过大，且重要的不是具体值而是值与值之间的相对大小关系，常离散化原数组后再建立权值数组。

离散化最优方法是用map，可以实现对应键值查询离散化结果，比使用unique和lower_bound的技术更优化，但是这时不能处理重复元素不同次序问题。
```
map<int,int>mp;
int cnt=1;
for(i=1;i<=n;i++)
{
    cin>>a[i];
    mp[a[i]]=1;
}
for(map<int,int>::iterator it=mp.begin();it!=mp.end();it++)
(*it).second=++cnt;
```
另外，权值数组是原数组无序性的一种表示：它重点描述数组的元素内容，忽略了数组的顺序，若两数组只是顺序不同，所含内容一致，则它们的权值数组相同。

权值树状数组可用来实现求逆序对（即全局偏序关系）的问题。因为偏序关系的传递性，如果

$$
a \prec b,b \prec c
$$

那么必定有$a \prec c$,就比如逆序对，能和$a$构成逆序对的一定是在$a$后面所有的比a小的数，形成偏序传递关系。

那么对于逆序对而言，将所求数组离散化为$1——N$后，能和$i$构成逆序的总数为$i+1——N$的全部元素个数之和。显然，可以将离散化优化为$N——1$,即元素的离散化结果为第几大，那么能和，能和$i$构成逆序的总数为$1——i-1$的全部元素个数之和。
```
int ans=0;
for(int i=1;i<=n;i++)
{
    if(mp[i]!=1)ans+=sum(mp[i]-1);
}
cout<<sum<<endl;
```

全局偏序关系的经典例题为[$CF-1042D$](https://codeforces.com/contest/1042),将区间和转化为两点差的关系，从而类比逆序对实现。这个题精妙的点在于由于离散化会把差值t的信息给丢失，所以我们干脆把$s[i]-t$也扔进离散序列一起离散了，这样就保存下来差值顺序的信息了。

```
#include <bits/stdc++.h>
#define lowbit(x) (x & (-x))
using namespace std;
const int MaxN = 200010;
int n;
int cnt;
long long t;
int c[MaxN << 2];
long long a[MaxN], s[MaxN];
map<long long, int>m;
int query(int x)
{
    int ans = 0;
    while(x)
        ans += c[x], x -= lowbit(x);
    return ans;
}
void add(int x, int val)
{
    while(x <= cnt)
        c[x] += val, x += lowbit(x);
}
int main()
{
    scanf("%d%lld", &n, &t);
    m[0] = 1;
    for(int i = 1; i <= n; i++)
        scanf("%lld", &a[i]), s[i] = s[i - 1] + a[i], m[s[i] - t] = m[s[i]] = 1;//前缀和，保存差值信息
    for(auto it = m.begin(); it != m.end(); it++)
        it -> second = ++cnt;//统一离散化
    long long ans = 0;
    add(m[0], 1);
    for(int i = 1; i <= n; i++)
    {
        ans += i - query(m[s[i] - t]);//区间查询
        add(m[s[i]], 1);
    }  
    printf("%lld", ans);
    return 0;
}
```

# Da-3 ST表与倍增维护区间最值

$ST$表（$Sparse Table$，稀疏表）是一种简单的数据结构，主要用来解决$RMQ$（$Range$ $Maximum/Minimum$ $Query$，区间最大/最小值查询）问题。它主要应用倍增的思想，可以实现$O(nlogn)$预处理、$O(1)$查询。

所谓RMQ问题，以最大值为例，是假如有一个数列$A$，给你一个区间$[l,r]$,要求$\max_{i\in [l,r]}(A_i)$。

$ST$表使用一个二维数组$f$，对于范围内的所有$f[a][b]$，先算出并存储 $$f[a][b]=\max_{i\in [a,a+2^b)}(A_i)$$（本文中的区间都是离散意义下的，只包含整数，所以此区间也可以写成$[a,a+2^b-1]$），这称为预处理。查询时，再利用这些子区间算出待求区间的最大值。

 预处理部分使用动态规划递归

 ```
 int f[MAXN][21]; // 第二维的大小根据数据范围决定，不小于log(MAXN)
 for (int i = 2; i <= n; ++i)
    Log2[i] = Log2[i / 2] + 1;
//预处理log值，避免调用函数太慢
for (int i = 1; i <= n; ++i)
    cin>>f[i][0]; // 读入数据
for (int i = 1; i <= 20; ++i)
    for (int j = 1; j + (1 << i) - 1 <= n; ++j)
        f[j][i] = max(f[j][i - 1], f[j + (1 << (i - 1))][i - 1]);
 ```

 <img src="Da-3-1.png" alt="预处理" style="zoom:80%;" />

在线查询
```
for (int i = 0; i < m; ++i)
{
    cin>>l>>r;
    int s = Log2[r - l + 1];
    cout<<max(f[l][s], f[r - (1 << s) + 1][s])<<endl;
}
```

 <img src="Da-3-2.png" alt="多组查询" style="zoom:80%;" />

 事实上，只要运算在集合上满足可结合和幂等律，其构成代数系统都可以使用ST表。显然最大值、最小值、最大公因数、最小公倍数、按位或、按位与都符合这个条件。

 经典模板题为[$POJ-3264$](http://poj.org/problem?id=3264)

```
#include <cstdio>
#include <cmath>
#include <algorithm>
#include <cstdlib>
using namespace std;
const int maxn = 5e4 + 1;
int fm[maxn][18], fn[maxn][18];
int a[maxn];
int log_[maxn];
int main()
{
    int n;
    int t;
    scanf("%d%d", &n, &t);
    log_[0] = -1;
    for (int i = 1; i <= n; i++)
    {
        scanf("%d", &a[i]);
        fm[i][0] = fn[i][0] = a[i];
        log_[i] = log_[i / 2] + 1;
    }
    for (int i = 1; i <= 16; i++)
    {
        for (int j = 1; j + (1 << i) - 1 <= n; j++)
        {
            fm[j][i] = max(fm[j][i - 1], fm[j + (1 << (i - 1))][i - 1]);
            fn[j][i] = min(fn[j][i - 1], fn[j + (1 << (i - 1))][i - 1]);
        }
    }

    while (t--)
    {
        int a, b;
        scanf("%d%d", &a, &b);
        int l = log_[b - a + 1];
        int finalmax = max(fm[a][l], fm[b - (1 << l) + 1][l]);
        int finalmin = min(fn[a][l], fn[b - (1 << l) + 1][l]);
        printf("%d\n", finalmax - finalmin);
    }
    system("pause");
    return 0;
}
```

