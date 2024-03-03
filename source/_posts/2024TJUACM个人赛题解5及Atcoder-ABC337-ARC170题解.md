---
title: 2024TJUACM个人赛题解5及Atcoder-ABC337/ARC170题解
date: 2024-01-22 18:38:41
tags:
  - 程序设计
  - C++
categories:
  - ICPC-CCPC
mathjax: true
---

摆烂的时间有点长了，理一理最近做的一些题。

$Atcoder-ABC337$打了$600$分耻辱下播，$D$被前缀和干了一波，$E$交互题也被$gank$了（哪怕都想到树状数组以及可能和二进制相关都没想到二进制编码），本想$ARC170$再好好打一打，结果第一题签到题就被干下来了……离大谱。

个人赛$5$也是相当抽象的一集，第三题$vector$未定义的数组越界被自己的编译器筛除了（？真的抽象，原因不明），结果样例本地运行通过线上直接$Wrong Answer \quad On \quad Test 1$，交上头了连着$WA$了五发；第四题无限大开小了（注意，$998244353$***是$10^9$内的最大质数***，但不是$int$的上界 ）属实是罚时把自己坑惨了。

<!--more-->

# TJ-1 Rudolf and the Another Competition

## 题目信息

### Problem Statement

Rudolf has registered for a programming competition that will follow the rules of ICPC. The rules imply that for each solved problem, a participant gets $ 1 $ point, and also incurs a penalty equal to the number of minutes passed from the beginning of the competition to the moment of solving the problem. In the final table, the participant with the most points is ranked higher, and in case of a tie in points, the participant with the lower penalty is ranked higher.

In total, $ n $ participants have registered for the competition. Rudolf is a participant with index $ 1 $ . It is known that $ m $ problems will be proposed. And the competition will last $ h $ minutes.

A powerful artificial intelligence has predicted the values $ t_{i, j} $ , which represent the number of minutes it will take for the $ i $ -th participant to solve the $ j $ -th problem.

Rudolf realized that the order of solving problems will affect the final result. For example, if $ h = 120 $ , and the times to solve problems are \[ $ 20, 15, 110 $ \], then if Rudolf solves the problems in the order:

- $ {3, 1, 2} $ , then he will only solve the third problem and get $ 1 $ point and $ 110 $ penalty.
- $ {1, 2, 3} $ , then he will solve the first problem after $ 20 $ minutes from the start, the second one after $ 20+15=35 $ minutes, and he will not have time to solve the third one. Thus, he will get $ 2 $ points and $ 20+35=55 $ penalty.
- $ {2, 1, 3} $ , then he will solve the second problem after $ 15 $ minutes from the start, the first one after $ 15+20=35 $ minutes, and he will not have time to solve the third one. Thus, he will get $ 2 $ points and $ 15+35=50 $ penalty.

Rudolf became interested in what place he will take in the competition if each participant solves problems in the optimal order based on the predictions of the artificial intelligence. It will be assumed that in case of a tie in points and penalty, Rudolf will take the best place.

### Input

The first line contains an integer $ t $ ( $ 1 \le t \le 10^3 $ ) — the number of test cases.

Then follow the descriptions of the test cases.

The first line of each test case contains three integers $ n, m, h $ ( $ 1 \le n \cdot m \le 2 \cdot 10^5, 1 \le h \le 10^6 $ ) — the number of participants, the number of problems, and the duration of the competition, respectively.

Then there are $ n $ lines, each containing $ m $ integers $ t_{i, j} $ ( $ 1 \le t_{i, j} \le 10^6 $ ) — the number of minutes it will take for the $ i $ -th participant to solve the $ j $ -th problem.

The sum of $ n \cdot m $ over all test cases does not exceed $ 2 \cdot 10^5 $ .

### Output

For each test case, output an integer — Rudolf's place in the final table if all participants solve problems in the optimal order.

## 题目解析

非常简单的题目，模拟ACM赛制计算排名。但是坑点写的时候有几个没注意到的。

1. 罚时。罚时的计算上和正式赛是一样的，计算时间的时候是从头到尾的计算，所以需要维护前缀和$sumer$。而且，判定终止的时候不能用罚时(因为算得是前缀和)判定，而是得用$timer$计时器进行维护。

2. 做题数。做题数到$timer$达到考试上限的时候终止。***但是，题目做完了的时候如果考试时间没有到，同样终止罚时和做题数的计算。$WA$爆数组就是判断语句只判定了考试时间到但是没有判定做题做完了。***

   至于为什么不是$RE$，因为用的是$Vector$，不知道其返回的到底是哪一个诡异的内存。

3. ***同分同罚时排序***。$Rudolf$在同分同罚时下优先靠前。优先堆需要$Special$ $Judge$.（判序号就行了）

## Accepted Code

```
#include<bits/stdc++.h>
using namespace std;
#define int long long
typedef struct node
{
    int sumnum;int pentally;int no;
    bool operator<(const node &x)const
    {
        return (x.sumnum>sumnum)||(x.sumnum==sumnum&&x.pentally<pentally)||(x.sumnum==sumnum&&x.pentally==pentally&&x.no<no);
    }
}node;
void solve()
{
    int n,m,h;
    cin>>n>>m>>h;
    vector<int>peo(m+1);
    priority_queue<node>q;
    for(int i=0;i<n;i++)
    {
        peo.clear();
        for(int j=0;j<m;j++)
        {
            int a;
            cin>>a;
            peo.push_back(a);
        }
        sort(peo.begin(),peo.end());
        int timer=0;
        int sumss=0;
        int j=0;
        while(j<m&&sumss+peo[j]<=h)
        {
            sumss+=peo[j];
            timer+=sumss;
            j++;
        }
        q.push({j,timer,i+1});
    }
    int ans=1;
    while(!q.empty()&&q.top().no!=1)
    {
        ans++;
        q.pop();
    }
    cout<<ans<<endl;
    return;

}
signed main()
{
    int t;
    cin>>t;
    while(t--)
    {
        solve();
    }
    system("pause");
    return 0;
}
```

# TJ-2 Rudolph and Christmas Tree

## 题目信息

### Problem Statement

Rudolph drew a beautiful Christmas tree and decided to print the picture. However, the ink in the cartridge often runs out at the most inconvenient moment. Therefore, Rudolph wants to calculate in advance how much green ink he will need.

The tree is a vertical trunk with identical triangular branches at different heights. The thickness of the trunk is negligible.

Each branch is an isosceles triangle with base $ d $ and height $ h $ , whose base is perpendicular to the trunk. The triangles are arranged upward at an angle, and the trunk passes exactly in the middle. The base of the $ i $ -th triangle is located at a height of $ y_i $ .

The figure below shows an example of a tree with $ d = 4, h = 2 $ and three branches with bases at heights $ [1, 4, 5] $ .

 ![](https://cdn.luogu.com.cn/upload/vjudge_pic/CF1846D/37fc4e66c82224ed8a6c688f81f74511a07dacd6.png)Help Rudolph calculate the total area of the tree branches.

### Input

The first line contains a single integer $ t $ ( $ 1 \le t \le 10^4 $ ) — the number of test cases.

Then follow the descriptions of the test cases.

The first line of each test case contains three integers $ n, d, h $ ( $ 1 \le n, d, h \le 2 \cdot 10^5 $ ) — the number of branches, the length of the base, and the height of the branches, respectively.

The second line of each test case contains $ n $ integers $ y_i $ $ (1 \le y_i \le 10^9, y_1 < y_2 < ... < y_n) $ — the heights of the bases of the branches.

The sum of $ n $ over all test cases does not exceed $ 2 \cdot 10^5 $ .

### Output

For each test case, output a single real number on a separate line — the total area of the tree branches. The answer will be considered correct if its absolute or relative error does not exceed $ 10^{-6} $ .

## 题目分析

非常简单的计算，使我的大脑旋转。

应用相似三角形计算重叠部分面积（我当时写的时候是直接累算不重叠部分，效果一样）

问题在于算高度差上界的时候取小了，赛后翻查$Codeforces$原数据发现第三测试点第十六项搞出来一个$999999999 $，当时一开始习惯用的是$998244353$，但是我一直误以为这是int内最大的质数（实际上$1e9+7$比他大，但是这家伙是个九位数我就以为是$9e9$大小了……)

还有就是误差不超过$10^{-6}$,要输出不小于$6$位的小数。

## Accepted Code

```
#include<bits/stdc++.h>
using namespace std;
#define double long double
double y[200009];
const double INF=9982443530;
void solve()
{
    int n;
    double d,h;
    cin>>n>>d>>h;
    double S=0.5*d*h;
    double ans=0;
    for(int i=1;i<=n;i++)
    {
        cin>>y[i];
    }
    y[n+1]=INF;
    for(int i=2;i<=n+1;i++)
    {
        double dely=y[i]-y[i-1];
        if(dely>h)dely=h;
        ans+=(1-1.0*(1.0*(h-dely)*(h-dely)/(1.0*h)/(1.0*h)))*S;
    }
    cout<<fixed<<setprecision(7)<<ans<<endl;
    return;
}
signed main()
{
    int t;
    cin>>t;
    while(t--)
    {
        solve();
    }
    system("pause");
    return 0;
}
```

# TJ-Ex-3 Rudolf and Snowflakes (Hard Version)

### 题面翻译

询问 $T$ 次：是否存在一个满 $k$（$k\ge 2$） 叉树节点数恰好为 $n$，且深度至少为 $2$。

### Problem Statement

This is the hard version of the problem. The only difference is that in this version $ n \le 10^{18} $ .

One winter morning, Rudolf was looking thoughtfully out the window, watching the falling snowflakes. He quickly noticed a certain symmetry in the configuration of the snowflakes. And like a true mathematician, Rudolf came up with a mathematical model of a snowflake.

He defined a snowflake as an undirected graph constructed according to the following rules:

- Initially, the graph has only one vertex.
- Then, more vertices are added to the graph. The initial vertex is connected by edges to $ k $ new vertices ( $ k > 1 $ ).
- Each vertex that is connected to only one other vertex is connected by edges to $ k $ more new vertices. This step should be done at least once.

The smallest possible snowflake for $ k = 4 $ is shown in the figure.

 ![](https://cdn.luogu.com.cn/upload/vjudge_pic/CF1846E2/2fc3f5caf761ddee75c017a3deae10ee696f63d1.png)After some mathematical research, Rudolf realized that such snowflakes may not have any number of vertices. Help Rudolf check whether a snowflake with $ n $ vertices can exist.

### Input

The first line of the input contains an integer $ t $ ( $ 1 \le t \le 10^4 $ ) — the number of test cases.

Then follow the descriptions of the test cases.

The first line of each test case contains an integer $ n $ ( $ 1 \le n \le 10^{18} $ ) — the number of vertices for which it is necessary to check the existence of a snowflake.

### Output

Output $ t $ lines, each of which is the answer to the corresponding test case — "YES" if there exists such $ k > 1 $ that a snowflake with the given number of vertices can be constructed; "NO" otherwise.

## 题目分析

题面翻译已经非常明确了。

这是困难版本，原题数据太水了，暴力都能直接过。

困难版本下，数据范围大幅增大，极限状态下($q=2$)数据必然能达到$10^9$

怎么处理？

注意到，如果是$q\ge 3$情况下，数据范围会重新缩回$1e6$,又回到了非突袭关。

对于非突袭关，直接暴力存$set$，然后查询。

***注意，需要用等比数列公式，要不然加法太多超时。而且，因为有分出不通过$set$的数据，所以对于1、2、3、4、5、6的输入需要特判。***

对于突袭模式剩下的数据范围，因为只可能$q=2$，故采用求根公式或者二分计算解决。

显然求根公式更快，不是吗？
$$
q_0=\frac{-1\pm \sqrt{4n-3}}{2}
$$

## Accepted Code

```
#include<bits/stdc++.h>
using namespace std;
#define int unsigned long long
map<int,int>mp;
__int128 now;
void init()
{
    int cnt=0;
    for(int i=2;i<=(1e6-1);i++)
    {
        now=i*i;
        for(int q=2;;q++)
        {
            now*=i;
            if((now-1)/(i-1)>1e18)break;
            else mp[(now-1)/(i-1)]=1;
        }
    }
}
void solve()
{
    int n;
    cin>>n;
    if(n<=6)
    {
        cout<<"NO"<<endl;
        return;
    }
    if(mp[n])cout<<"YES"<<endl;
    else 
    {
        int ans=(-1+sqrt(4*n-3))/2;
        if(ans*ans+ans+1!=n)
        cout<<"NO"<<endl;
        else cout<<"YES"<<endl;
    }
    return;

}
signed main()
{
    init();
    int t;
    cin>>t;
    while(t--)
    {
        solve();
    }
    system("pause");
    return 0;
}
```

# TJ-4 Restore the Weather

### 题面翻译

本题有 $t$ 组测试数据。

对于每组测试数据，给定整数 $n$,$k$ 与两个长度为 $n$ 的数组 $a$ 与 $b$。

要求重新排列 $b$ 使得对于每一个 $1\le i \le n$，满足 $|a_i - b_i| \le k$

保证一定有解。

对于 $100\%$ 的数据满足：
* $1 \le t \le 10^4$
* $\sum_{i=1}^t n \le 10^5$
* $-10^9 \le a_i, b_i \le 10^9$
* $0 \le k \le 10^9$

## Problem Statement

You are given an array $ a $ containing the weather forecast for Berlandia for the last $ n $ days. That is, $ a_i $ — is the estimated air temperature on day $ i $ ( $ 1 \le i \le n $ ).

You are also given an array $ b $ — the air temperature that was actually present on each of the days. However, all the values in array $ b $ are mixed up.

Determine which day was which temperature, if you know that the weather never differs from the forecast by more than $ k $ degrees. In other words, if on day $ i $ the real air temperature was $ c $ , then the equality $ |a_i - c| \le k $ is always true.

For example, let an array $ a $ = \[ $ 1, 3, 5, 3, 9 $ \] of length $ n = 5 $ and $ k = 2 $ be given and an array $ b $ = \[ $ 2, 5, 11, 2, 4 $ \]. Then, so that the value of $ b_i $ corresponds to the air temperature on day $ i $ , we can rearrange the elements of the array $ b $ so: \[ $ 2, 2, 5, 4, 11 $ \]. Indeed:

- On the $ 1 $ st day, $ |a_1 - b_1| = |1 - 2| = 1 $ , $ 1 \le 2 = k $ is satisfied;
- On the $ 2 $ nd day $ |a_2 - b_2| = |3 - 2| = 1 $ , $ 1 \le 2 = k $ is satisfied;
- On the $ 3 $ rd day, $ |a_3 - b_3| = |5 - 5| = 0 $ , $ 0 \le 2 = k $ is satisfied;
- On the $ 4 $ th day, $ |a_4 - b_4| = |3 - 4| = 1 $ , $ 1 \le 2 = k $ is satisfied;
- On the $ 5 $ th day, $ |a_5 - b_5| = |9 - 11| = 2 $ , $ 2 \le 2 = k $ is satisfied.

### Input

The first line of input data contains a single integer $ t $ ( $ 1 \le t \le 10^4 $ ) — the number of test cases.

The description of the test cases follows.

The first line of each test case contains two integers $ n $ ( $ 1 \le n \le 10^5 $ ) and $ k $ ( $ 0 \le k \le10^9 $ ) — the number of days and the maximum difference between the expected and actual air temperature on each day.

The second line of each test case contains exactly $ n $ integers — elements of array $ a $ ( $ -10^9 \le a_i \le 10^9 $ ).

The third line of each test case contains exactly $ n $ integers — elements of array $ b $ ( $ -10^9 \le b_i \le 10^9 $ ).

It is guaranteed that the sum of $ n $ over all test cases does not exceed $ 10^5 $ , and that the elements of array $ b $ can always be rearranged so that the equality $ |a_i - b_i| \le k $ is true for all $ i $ .

### Output

On a separate line for each test case, output exactly $ n $ numbers — the values of air temperature on each of the days in the correct order.

If there is more than one answer — output any of them.

## 题目分析

这个题目多少是挺抽象的一个题目。首先可以想到暴力枚举每一种情况肯定是超时间的，涉及到n个元素的全排列，时间长度成本过大。

观察数据范围，基本肯定本题可以在线性的时间复杂度或者最多支持$nlogn$的算法复杂度。

想到极端情况下，$a$之间元素差异很大，$k$浮动范围很小，此时真实天气的浮动范围没有交集的时候，对$a$和$b$重新排序，那么$a_i$ 一定是对应$b_i$的预测天气。（因为***题目保证有解，并且可能不存在唯一解***）

(赛场上根据题目总体难度推断直接就交了一发，没想到还真蒙过去了)

现在严谨的证明该做法的正确性。

### 证明1：（严谨）

继续上面的思路，那如果$a$之间元素差异足够小，浮动范围$k$足够大，此时真实天气浮动范围


$$
\forall b_i \in b ,[b-k,b+k]
$$


涵盖了所有预测天气的值，那么此时不管什么顺序都是正解，***可行解域包含排序后数组。***

对于其他情况，易证，只要存在两个真实天气的浮动范围没有交集，那么这两天的真实天气一定服从大小次序分布。对于相交部分，会视情况可交换（相互覆盖）、不可交换（单侧覆盖）。

故，有序序列一定是可行解，且一定是最优的可行解。

如果存在某一种可能的真实天气，对于预测天气而言，单调不降序列无解而存在一个逆序数为1的解的话，反证明其不可能存在。

1. 如果二者浮动范围无交集，显然不可能。假设分别为$a_i、a_j、b_i、b_j，i<j$,那么必然有
   $$
   a_i+k<a_j-k
   $$
   所以必然有$b_i<b_j$,冲突无解。

2. 如果二者浮动范围有交集并且相邻。

   1. 双预测值均被范围覆盖，此时为下述情况

   $$
   a_i-k<a_j-k<a_i<a_j<a_i+k<a_j+k
   $$

    	  此时满足条件的$b_i$和$b_j$交换后仍然满足浮动条件，与假设矛盾。

   2. 其他不再另行证明。

### 证明2：

使用贪心的构造想法。

***如果想让两个序列的对应标准差之和最小，那么两个序列一定都是按同种排序顺序从小到大或者从大到小排序的***

在$Codeforces$ $Round$ $920Div.3$的$D$中用到了。

那么此时虽然各项标准差不一定都是最优的，但是他们一定都是小于等于$k$的。

因为存在各相差都小于等于$k$的解，最小总标准差就不会高于$kn$。

证明结束，顺序一定是一个解。

（好像有点问题？）

程序就不放了，没啥意思。只是理论思维挺好玩的。
