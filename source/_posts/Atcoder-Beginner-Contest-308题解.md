---
title: Atcoder Beginner Contest 308题解
tags:
  - 程序设计
  - C++
categories:
  - ICPC-CCPC
abbrlink: '80974947'
mathjax: true
date: 2023-07-04 14:53:34
---

题目来源：[Atcoder-abc308](https://atcoder.jp/contests/abc308); 

<!--more-->

# AT-EX-1  Snuke Maze

***[Problem Statement](https://atcoder.jp/contests/abc308/tasks/abc308_d)***

题目大意：

走迷宫，要求走过的路径必须是“s-n-u-k-e-s-n……”，寻找可能的最短路径。

伴生题目： ***[AT-11 Swap Places](https://skyeyecontroller.top/p/4fac8f80.html#at-11-swap-places)***

## 题目解析

考察点：$BFS$,$BFS+A*$（也许算可以这么优化，但好像实际上比$BFS$还慢？）

这个题和伴生题目同属于一个思考模式，bfs都是作为寻找 ***合法最短路径*** 的算法来使用，不能按照先无限制广搜再排除不合条件的路径，这样的话非法路径对节点的访问影响无法消除（为什么见伴生题），所以让不合条件的点直接不能进入广搜过程（这一点又和 ***[AT-4 Virus 2](https://skyeyecontroller.top/p/addc2792.html#at-4-f-virus2)*** 挺像的），直接一击毙命，bfs的结果就是合法最短路径。所以，节点访问不能和步数挂钩，否则限制重复访问的措施将会失效。（一开始开$visit[i][j][k]$其实还是想着先无限制广搜再找合要求最短路径的,后来Vscode直接爆$TLE$错误才意识到是步数相当于直接取消了这个$visit$限制。）

另外，可以加上曼哈顿距离形成$A*$，利用优先队列原则快速向目标终点广搜。


$AC$代码：

```
#include <bits/stdc++.h>
using namespace std;
string s[501];
bool visited[501][501];
int n, m;
string mod = "esnuk";//注意细节问题，求模的结果处理
typedef pair<int, int> p;
int dis[4][2] = {{0, 1}, {0, -1}, {-1, 0}, {1, 0}};
struct node
{
    p pos={0,0};
    int step=0;
    int manhaton=0;
    bool operator<(const node &x) const
    {
        return x.manhaton < manhaton;
    }
    node()
    {};
    node(p pos,int step)
    {
        this->pos=pos;
        this->step=step;
        this->manhaton=abs(pos.first-n)+abs(pos.second-m);
    };
};
void bfs()
{
    priority_queue<node> q;
    q.push(node({1, 1}, 1));
    if (s[1][0] != 's')
    {
        std::cout << "No" << endl;
        return;
    }
    while (!q.empty())
    {
        node top = q.top();
        q.pop();
        if (top.pos == p{n, m})
        {
            std::cout << "Yes" << endl;
            return;
        }
        if (visited[top.pos.first][top.pos.second])
            continue;
        visited[top.pos.first][top.pos.second] = 1;
        for (int i = 0; i < 4; i++)
        {
            node next({top.pos.first + dis[i][0], top.pos.second + dis[i][1]}, top.step + 1);
            if (next.pos.first >= 1 && next.pos.first <= n && next.pos.second >= 1 && next.pos.second <= m)
            {
                if (mod[next.step % 5] == s[next.pos.first][next.pos.second - 1])
                {
                    q.push(next);
                }
            }
        }
    }
    std::cout << "No" << endl;
    return;
}
int main()
{
    cin >> n >> m;
    for (int i = 1; i <= n; i++)
    {
        cin >> s[i];
    }
    bfs();
    system("pause");
    return 0;
}
```

# AT-EX-2  MEX

***[Problem Statement](https://atcoder.jp/contests/abc308/tasks/abc308_e)***

题目大意：

给定一串卡片，每张卡片正面有$M、E、X$三种字符的其中一个，背面有$0、1、2$三种数字的其中一个。按照从前向后的顺序依次挑出$M、E、X$三个字符卡，取三张字符卡背面的三个数字$x,y,z$求其$mex(x,y,z)$函数值，求出所有情况的函数值总和。

同话题题目： ***[AT-13 Mex on Blackboard](https://skyeyecontroller.top/p/4fac8f80.html#at-13-mex-on-blackboard)***

## 题目解析

首先，2e5的数据范围明确了暴力搜索的$O(n^3)$的做法完全不可取，那怎么统计这些$MEX$和$MEX$的$mex()$结果？

一开始看错了题目没有注意到从前向后的顺序依次挑出$M、E、X$这句话，然后就想到，$mex()$函数的值一共就$27$种可能，按照结果分配为$8$种$0$，$7$种$1$，$6$种$2$，$6$种$3$，这样只需要记录下来各种卡片背面数字为0，1，2，各有几张然后九个数排列组合的乘就可以了。

但是要求按顺序，那就不能值这么盲目的统计了，因为像"XME"这种不符合要求。

要求时间复杂度为$O(n)$，然后我就想到，对于每一个$'M'$，记录$'M'$后面的$'E'$和$'X'$各有几个

嗯，可行，速速码了一遍,然后被法官速通……

问题出在了$'MXE'$身上。这个$X$和$E$的相对位置这么是确定不了的。

一种想法是接着记录$E$后面的$X$数，肯定可行，需要开两次遍历四组$vector$，但是还有一个更可行的，直接对$E$统计$M$和$X$——$E$前面$M$的数字以及$E$后面$X$的数字。

然后就没了。

还有一件事————

开$longlong$,否则爆零。

$AC$代码：

```
#include <bits/stdc++.h>
using namespace std;
#define int long long
typedef struct nodeE
{
    int pos;
    int num;
    int targetnum[3];
} nodeE;
vector<nodeE> M;
vector<nodeE> X;
int a[200001];
int n;
int m[3], x[3];
string s;
int mex(int a,int b,int c)
{
    for(int i=0;i<=3;i++)
    {
        if(a!=i&&b!=i&&c!=i)return i;
    }
    return 3;
}
signed main()
{
    cin >> n;
    for (int i = 0; i < n; i++)
        cin >> a[i];
    for (int i = 0; i < n; i++)
    {
        char c;
        cin >> c;
        s += c;
        switch (c)
        {
        case 'M':
            m[a[i]]++;
            break;
        case 'E':
            M.push_back(nodeE({i, a[i], {m[0], m[1], m[2]}}));
            break;
        case 'X':
            x[a[i]]++;
        }
    }
    for (int i = 0; i < n; i++)
    {
        switch (s[i])
        {
        case 'M':
            m[a[i]]--;
            break;
        case 'E':
            X.push_back(nodeE({i, a[i], {x[0], x[1], x[2]}}));
            break;
        case 'X':
            x[a[i]]--;
        }
    }
    int ansf=0;
    for(int i=0;i<M.size();i++)
    {
        for(int j=0;j<=2;j++)
        for(int k=0;k<=2;k++)
        {
            ansf+=mex(M[i].num,j,k)*(M[i].targetnum[j])*(X[i].targetnum[k]);
        }
    }
    cout<<ansf<<endl;
    system("pause");
    return 0;
}
```

# AT-EX-3  Vouchers

***[Problem Statement](https://atcoder.jp/contests/abc308/tasks/abc308_f)***

题目大意：

你要去买$N$件商品，每件商品的价值为$A_i$.你手里有$M$张优惠券，每张在购买时满$L_i$元即可使用，使用后原商品优惠$D_i$元。每张券只可使用一次，购买一个物品时只能使用一张。问最少花多少钱买下所有？

## 题目解析

挺有意思的一道贪心题目，想要花更少的钱就要用更多金额的满减券。这是关键点。

如果优惠券全能用完，那就全用完。

***如果不能用完，优先使用可用范围内优惠最大的，剩下不可用的浪费。***

***有券就用，不是非得等着大券给大件用，反正用了总价少就行***

正解就是，对于价格从小到大的商品（大到小也行），每次枚举可用的券，取最大优惠券使用，剩下的放回。

先说错误

最开始的时候，我形成了一种错觉，就是劵用的越多越好而忽略了劵的面值，恰巧样例二和这个错误思路撞上了，然后就码了一个按照使用限制从大到小的集合贪心，结果WA了几乎全部的数据，只有最后的两个Hack数据和样例过了。

这个时候我想，这没有道理，于是我又自己手捏了这一组边界数据：

```
10 5
1 2 2 5 5 5 6 6 6 9
2 2 7 7 8
2 2 3 4 1

```
现在想这组数据还是很刁钻的，第一个物品没有券可以用，有重复的券，有使用条件更高但优惠力度底的券(满8减1)

然后就发现了大物件用大条件券的局限性就是他会用8-1而不用7-4

然后修改后成为了按照每一个物品找到能用券的上界（不含，开区间，以和$[$ $begin(),end()$ $)$区间统一）

然后又WA，因为使用8-1的问题还没有解决。

这是我的目光放到了第一条：

***如果不能用完，优先使用可用范围内优惠最大的，剩下不可用的浪费。***

那么就在开一个set筛选每次可用的劵的最大值来做。

确实成功了，也失败了——$TLE$

那必然，搁谁来回的在两个集合倒腾都会超时，删除和添加的操作都是$log_2 N$级别的，但是架不住$N^2$级别的重复。

所以最后敲定的思路就是枚举劵，看集合里还没买的物品能不能用，能用就买，不能用就不用，按照可优惠力度排序优惠券。

$AC$代码（被注释掉的是$TLE$的正确代码）
```
/*#include <bits/stdc++.h>
using namespace std;
#define int long long
#define p pair<int, int>
multiset<p> discount;
multiset<p,greater<p>> workplace;
multiset<int> price; // 全局应用的是大于为小于，所以lower_bound也有变化，变为查找第一个比目标元素小的
int a[200001], b[200001], c[200001];
int n, m;
signed main()
{
    cin >> n >> m;
    for (int i = 1; i <= n; i++)
    {
        cin >> a[i];
        price.insert(a[i]);
    }
    for (int i = 1; i <= m; i++)
        cin >> b[i];
    for (int i = 1; i <= m; i++)
    {
        cin >> c[i];
        discount.insert(p(b[i], c[i]));
    }
    int ans = 0;
    while (!price.empty())
    {
        if (discount.empty())
        {
            ans += (*price.begin());
            price.erase(price.begin());
            // 回忆，multiset的erase函数如果传入的是一个数字，将会删除集合中所有的这个数字；如果传入的是一个迭代器，只删除这一个。
            continue;
        }
        int pnow = *(price.begin());
        price.erase(price.begin());
        auto it=discount.upper_bound({pnow,pnow});
        if(it==discount.begin())
        {
            ans+=pnow;
            continue;
        }
        else
        {
            workplace.clear();
            for(auto i=discount.begin();i!=it;i++)
            {
                workplace.insert({(*i).second,(*i).first});
            }
            discount.erase(discount.begin(),it);
            auto i=workplace.begin();
            ans+=pnow-(*i).first;
            workplace.erase(i);
            for(auto i=workplace.begin();i!=workplace.end();i++)
            {
                discount.insert({(*i).second,(*i).first});
            }
        }
    }
    cout << ans << endl;
    system("pause");
    return 0;
}*/

#include <bits/stdc++.h>
using namespace std;
#define int long long
#define p pair<int, int>
multiset<p, greater<p>> discount;
multiset<int> price; // 全局应用的是大于为小于，所以lower_bound也有变化，变为查找第一个比目标元素小的
int a[200001], b[200001], c[200001];
int n, m;
signed main()
{
    cin >> n >> m;
    for (int i = 1; i <= n; i++)
    {
        cin >> a[i];
        price.insert(a[i]);
    }
    for (int i = 1; i <= m; i++)
        cin >> b[i];
    for (int i = 1; i <= m; i++)
    {
        cin >> c[i];
        discount.insert(p(c[i], b[i]));
    }
    int ans = 0;
    while (!price.empty())
    {
        if (discount.empty())
        {
            ans += (*price.begin());
            price.erase(price.begin());
            // 回忆，multiset的erase函数如果传入的是一个数字，将会删除集合中所有的这个数字；如果传入的是一个迭代器，只删除这一个。
            continue;
        }
        auto disit = discount.begin();
        auto it = price.lower_bound((*disit).second);
        if (it != price.end())
        {
            ans += (*it) - (*disit).first;
            price.erase(it);
        }
        discount.erase(disit);
    }
    cout << ans << endl;
    system("pause");
    return 0;
}
```

话外题一个有意思的，就是lower_bound()之于pair类型的排序特性有点意思，挖个坑。