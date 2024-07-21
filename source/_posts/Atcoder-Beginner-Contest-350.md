---
title: Atcoder Beginner Contest 350
tags:
  - atcoder
  - C++
categories:
  - ICPC-CCPC
mathjax: true
abbrlink: a9f81f9b
date: 2024-04-27 15:32:13
---

数据结构场。$LCT+Splay$教学。

<!--more-->

# TR-1 伸展树$SplayTree$​

## 1.定义

**Splay 树**, 或 **伸展树**，是一种平衡二叉查找树，它通过 **Splay/伸展操作** 不断将某个节点旋转到根节点，使得整棵树仍然满足二叉查找树的性质，能够在均摊$O(logn)$时间内完成插入，查找和删除操作，并且保持平衡而不至于退化为链。

本质属于二叉查找树。

## 2.工作原理

根据局部性准则，程序倾向于访问上一次访问过的元素。$Splay$树根据这一原则，将上一次访问的结点采用策略旋转到根节点，以便于下一次访问的时候采用。

为什么要采用这种特殊的$Splay$策略？

如果我们只是单纯的采用单节点旋转的方式将目标点旋转到根依旧是可以的，但是这样会产生一个问题，就是可能其他被旋走的结点最坏的同时达到了新根节点旋转之前的深度，这样在处理最坏访问时相当于***没有发生旋转。***

一个简单的例子就是查询只有左子树的有序二叉查找树$1,2……,9$ 

1. 如果我们查询$1$，则$1$需要$9$次比较，查询结束后，将$1$逐步单旋转到树根位置，此时的树形是$1$为树根只有右孩子$9$,$9$节点只有左子树。 
2. 如果继续查询$2$，则也需要$9$次比较，查询结束后使用单旋转将$2$转到树根位置。
3. 如果继续查询节点$3$，则需要$8$次比较。

也就是说以此类推，如果节点数是N的话，我们需要$O(n^2)$​次查询时间。这种简单的旋转虽然把查询的节点推到的根节点，但也把其他节点推到了和它相似的深度，得不偿失。我们想以何种方法***既可以把根节点推到树根的位置，又可以进可能减少其他节点被推的深度从而达到一种稳定的更优最坏可能***，于是我们有了**伸展**的旋转方式。

## 3. 单节点左右旋方法

**旋转需要保证**：

- 整棵 Splay 的中序遍历不变（不能破坏二叉查找树的性质）。
- 受影响的节点维护的信息依然正确有效。
- `root` 必须指向旋转后的根节点。

**具体旋转流程(以（右）旋为例)：**目标节点$x$,父节点$y$，祖父节点$z$.

- $y$的（左）儿子指向$x$的（右）儿子。更新父子关系。

- $x$的（右）儿子指向$y$。更新父子关系。需注意，第一步的操作使用的时$x$​原先的（右）儿子。

- $z$原先为$y$儿子的地方变成$x$​。更新父子关系。

- **按顺序更新**$y、x$​​的大小信息。***大小信息=左子树大小+右子树大小+节点权值个数***

  

  ![img](https://oi-wiki.org/ds/images/splay-rotate.svg)

```
void routate(int x)
{
    int y = fa[x], z = fa[y], tar = get(x);
    ch[fa[x]][tar] = ch[x][tar ^ 1];
    if (ch[x][tar ^ 1])
        fa[ch[x][tar ^ 1]] = y;
    ch[x][tar ^ 1] = y;
    fa[y] = x;
    fa[x] = z;
    if (z)
        ch[z][y == ch[z][1]] = x;
    maintain(y);
    maintain(x);
    return;
}
```

## 4.$Splay$​旋转策略

### 狭义$Splay$操作

1. 如果目标节点父节点为根，直接转根即可。

2. 如果目标节点父节点不为根。

   2.1 目标父节点、祖父结点在同一侧（一字型），先转父节点再转目标节点。

   ​	![splay-zig-zig](https://oi-wiki.org/ds/images/splay-zig-zig.svg)

   2.2 否则（之字形），转两次子节点。

   ​	![splay-zig-zag](https://oi-wiki.org/ds/images/splay-zig-zag.svg)

### 广义$Splay$操作

将目标操作节点$Splay$到目标位置的子节点上。对于狭义$Splay$而言，其目标位置为端节点$0$,目标位置子节点为根节点$rt$

```
void splay(int x, int tar = 0)
{
    while (fa[x] != tar)
    {
        int f = fa[x];
        if (fa[f] != tar)
            routate(get(f) == get(x) ? f : x);
        routate(x);
    }
    if (!tar)
        rt = x;
    return;
}
```

## 5.模板程序

$Splay$树可维护以下操作：

1. 插入 $x$ 数；
2. 删除 $x$ 数（若有多个相同的数，只删除一个）；
3. 查询 $x$ 数的排名（若有多个相同的数，输出最小的排名）；
4. 查询排名为 $x$ 的数；
5. 求$ x$ 的前驱（前驱定义为小于 $x$，且最大的数。不保证$x$一定已插入在数据结构中）；
6. 求 $x$ 的后继（后继定义为大于 $x$，且最小的数。不保证$x$一定已插入在数据结构中）。

```
#include <bits/stdc++.h>
using namespace std;
#define int long long
const int maxn = 1e5 + 1;
#define IOS                      \
    ios::sync_with_stdio(false); \
    cin.tie(nullptr);            \
    cout.tie(nullptr);
int cnt[maxn], val[maxn], fa[maxn], sz[maxn], ch[maxn][2], rt, tot;
//更新节点大小信息
void maintain(int x)
{
    return void(sz[x] = sz[ch[x][0]] + sz[ch[x][1]] + cnt[x]);
}
//清除节点信息
void clear(int x)
{
    return void(sz[x] = fa[x] = cnt[x] = ch[x][0] = ch[x][1] = val[x] = 0);
}
//判断节点是父节点的左儿子还是右儿子，routate由此决策左旋还是右旋
bool get(int x)
{
    return ch[fa[x]][1] == x;
}
//旋转操作
void routate(int x)
{
    int y = fa[x], z = fa[y], tar = get(x);//tar为1表示x是y的右儿子，0表示x是y的左儿子
    ch[fa[x]][tar] = ch[x][tar ^ 1];//将x的tar儿子挂到y的tar儿子上
    if (ch[x][tar ^ 1])
        fa[ch[x][tar ^ 1]] = y;//更新x的tar儿子的父节点
    ch[x][tar ^ 1] = y;//将y挂到x的tar儿子上
    fa[y] = x;//更新y的父节点
    fa[x] = z;//更新x的父节点
    if (z)
        ch[z][y == ch[z][1]] = x;//更新z的儿子
    maintain(y);
    maintain(x);//更新x和y的信息
    return;
}
//伸展操作
void splay(int x, int tar = 0)
{
    if (!tar)
        rt = x;//如果没有指定伸展的目标节点，那么x就是根节点
    while (fa[x] != tar)//当x的父节点不是目标节点时
    {
        int f = fa[x];
        if (fa[f] != tar)//如果x的祖父节点不是目标节点
            routate(get(f) == get(x) ? f : x);//如果x和f的方向相同，那么先旋转f，否则旋转x
        routate(x);
    }
    return;
}
//插入操作
//结束时，新插入值在根
void insert(int x)
{
    if (!rt)//如果树为空，那么直接插入
    {
        val[++tot] = x;
        cnt[tot]++;
        rt = tot;
        maintain(rt);
        return;
    }
    int cur = rt, f = 0;
    while (1)
    {
        if (x == val[cur])//如果x已经存在，那么直接更新cnt
        {
            cnt[cur]++;
            maintain(cur);
            maintain(f);
            splay(cur);
            break;
        }
        f = cur;
        cur = ch[cur][x > val[cur]];//根据x的大小决定往左儿子还是右儿子走,二叉搜索
        if (!cur)//如果走到了空节点，那么直接插入
        {
            val[++tot] = x;
            cnt[tot]++;
            ch[f][x > val[f]] = tot;
            fa[tot] = f;
            maintain(tot);
            maintain(f);//更新。必须先更新新儿子再更新父节点
            splay(tot);//将新插入的节点伸展到根节点
            break;
        }
    }
    return;
}
//查询数x的排名
//返回时，x在根
//返回排名编号
int rank(int x)
{
    int cur = rt, f = 0;
    int rk = 0;
    while (1)
    {
        if (x < val[cur])
        {
            cur = ch[cur][0];//如果x小于当前节点的值，那么往左儿子走
            continue;
        }
        rk += sz[ch[cur][0]];
        if (x == val[cur])//如果x等于当前节点的值，那么直接返回排名,多节点返回最小的排名
        {
            splay(cur);//将当前节点伸展到根节点
            return rk + 1;
        }
        rk += cnt[cur];//加上当前节点的数量
        cur = ch[cur][1];//往右儿子走
    }
    return 0;
}
//查询排名为k的数
//返回时，排名为k的数在根
//返回排名为k的数的节点编号
int kth(int k)
{
    int cur = rt, f = 0;
    while (1)
    {
        if (ch[cur][0] && k <= sz[ch[cur][0]])//如果左儿子存在且k小于等于左儿子的大小
        {
            cur = ch[cur][0];//往左儿子走
            continue;
        }
        k -= cnt[cur] + sz[ch[cur][0]];//减去当前节点的数量和左儿子的大小
        if (k <= 0)//如果k小于等于0，那么当前节点就是答案
        {
            splay(cur);//将当前节点伸展到根节点(多个排名取最小)
            return cur;
        }
        cur = ch[cur][1];
    }
    return 0;
}
//查询前驱
//查询的是当前根的前驱
//返回时，前驱在根
//返回前驱节点编号
int pre()
{
    int cur = ch[rt][0];
    if (!cur)
        return 0;
    while (ch[cur][1])
    {
        cur = ch[cur][1];
    }
    splay(cur);
    return cur;
}
//查询后继
//查询的是当前根的后继
//返回时，后继在根
//返回后继节点编号
int suf()
{
    int cur = ch[rt][1];
    if (!cur)
        return 0;
    while (ch[cur][0])
        cur = ch[cur][0];
    splay(cur);
    return cur;
}
//删除操作
//删除的是当前根
//特定目标删除需要将目标伸展到根
//删除后，根为前驱。如果没有前驱，那么根为后继
void del(int x)
{
    ::rank(x);//将x伸展到根
    if (cnt[rt] > 1)//如果x的数量大于1，那么直接减少数量
    {
        cnt[rt]--;
        maintain(rt);
        return;
    }
    if (!ch[rt][0] && !ch[rt][1])//如果x没有儿子，那么直接删除
    {
        clear(rt);
        rt = 0;
        return;
    }
    if (!ch[rt][0])//如果x只有右儿子，那么直接将右儿子提上来
    {
        int cur = rt;
        rt = ch[rt][1];
        fa[rt] = 0;
        clear(cur);
        return;
    }
    if (!ch[rt][1])//如果x只有左儿子，那么直接将左儿子提上来
    {
        int cur = rt;
        rt = ch[rt][0];
        fa[rt] = 0;
        clear(cur);
        return;
    }
    //如果x有左右儿子，那么将前驱提上来
    int cur = rt;
    int pre = ::pre();
    fa[ch[cur][1]] = pre;
    ch[pre][1] = ch[cur][1];
    clear(cur);
    maintain(rt);
    return;
}
signed main()
{
    int q;
    cin >> q;
    while (q--)
    {
        int op, tar;
        cin >> op >> tar;
        switch (op)
        {
        case 1:
            insert(tar);
            break;
        case 2:
            del(tar);
            break;
        case 3:
            cout << ::rank(tar) << endl;
            break;
        case 4:
            cout << val[kth(tar)] << endl;
            break;
        case 5:
            insert(tar);
            cout << val[pre()] << endl;
            del(tar);
            break;
        case 6:
            insert(tar);
            cout << val[suf()] << endl;
            del(tar);
            break;
        }
    }
    system("pause");
    return 0;
}
```

## TR-2 实链剖分$Link$-$Cut$-$Tree$

