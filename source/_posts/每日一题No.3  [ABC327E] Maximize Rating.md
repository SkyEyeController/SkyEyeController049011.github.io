---
title: 每日一题No.3
tags:
  - 程序设计
  - C++
categories:
  - ICPC-CCPC
abbrlink: 3a29f7ee
mathjax: true
date: 2023-11-09 18:29:11
---

[题目来源：ABC326-E](https://atcoder.jp/contests/abc327/tasks/abc327_e )

<!--more-->



# DQ-3 Maximize Rating

## 题目信息

### 题面翻译

高桥君参加了 $N$ 场比赛，第 $i$ 场比赛的表现是 $P_i$ 分。

高桥君要选择至少一场比赛来计算等级分，设选择的第 $i$ 场比赛的表现是 $Q_i$ ，总共选择了 $k$ 场比赛来计算，那么最终的等级分为 $\begin{aligned}\frac{\sum_{i=1}^k(0.9)^{k-i}Q_i}{\sum_{i=1}^k(0.9)^{k-i}}-\frac{1200}{\sqrt{k}}\end{aligned}$ 。

设计一个程序来计算最终的等级分的最大值是多少，你的输出与标准答案的相对或绝对误差小于 $10^{-6}$ 即被视为正确。

### 题目描述

[problemUrl]: https://atcoder.jp/contests/abc327/tasks/abc327_e

高橋君は $ N $ 回コンテストに参加し、$ i $ 回目に参加したコンテストにおいてパフォーマンス $ P_i $ を獲得しました。  
高橋君はこの中から ($ 1 $ つ以上) いくつかのコンテストを選び、それらの結果から計算される高橋君のレートを最大にしたいと考えています。

コンテストをうまく選んだとき、高橋君のレートとしてあり得る最大の値を求めてください。

ただし、高橋君のレート $ R $ は、高橋君の選んだコンテストの数が $ k $ 個であり、 選んだコンテストにおけるパフォーマンスが **参加した順に** それぞれ $ (Q_1,Q_2,\ldots,Q_k) $ であるとき、

$ \displaystyle\ R=\frac{\sum_{i=1}^k\ (0.9)^{k-i}Q_i}{\sum_{i=1}^k\ (0.9)^{k-i}}-\frac{1200}{\sqrt{k}} $ によって計算されます。

### 输入格式

入力は以下の形式で標準入力から与えられる。

> $ N $ $ P_1 $ $ P_2 $ $ \ldots $ $ P_N $

### 输出格式

高橋君のレートとしてあり得る最大の値を出力せよ。  
出力は、真の値との絶対誤差または相対誤差が $ 10^{-6} $ 以下のとき正解と判定される。

### 样例 #1

#### 样例输入 #1

```
3
1000 600 1200
```

#### 样例输出 #1

```
256.735020470879931
```

### 样例 #2

#### 样例输入 #2

```
3
600 1000 1200
```

#### 样例输出 #2

```
261.423219407873376
```

### 样例 #3

#### 样例输入 #3

```
1
100
```

#### 样例输出 #3

```
-1100.000000000000000
```

### 提示

#### 制約

- $ 1\leq\ N\leq\ 5000 $
- $ 1\leq\ P_i\leq\ 5000 $
- 入力はすべて整数

#### Sample Explanation 1

高橋君が $ 1 $ 回目と $ 3 $ 回目のコンテストを選んだ時、レートは、 $ \displaystyle\ R=\frac{0.9\times\ 1000+\ 1.0\times\ 1200}{0.9+1.0}-\frac{1200}{\sqrt{2}}=256.73502... $ となり、この時レートが最大となります。

#### Sample Explanation 2

$ 1,2,3 $ 回目のコンテストすべてを選んだとき、レートが最大となります。

#### Sample Explanation 3

レートは負になることもあります。



## 题目分析：

首先讨论这个题目的函数方程：
$$
\displaystyle\ R=\frac{\sum_{i=1}^k\ (0.9)^{k-i}Q_i}{\sum_{i=1}^k\ (0.9)^{k-i}}-\frac{1200}{\sqrt{k}}
$$


不难发现这是一个很经典的$dp$问题，针对第$i$个数，有选择与不选择两种选法。

但是，直接运算会很困难。所以，可以只对上半部分进行$dp$:


$$
dp[i][j]=max(dp[i-1][j-1]*0.9+a[i],dp[i-1][j])
$$


注意大限制为从$1$到$i$选$j$个数字，所以
$$
dp[i][j]=max(dp[i-1][j-1]*0.9+a[i],dp[i-1][j]),1\leq i \leq n,1\leq j \leq i
$$


## AC代码

```
#include<bits/stdc++.h>
using namespace std;
int n;
double dp[5001][5001];
double a[5001];
double nine[5001];
void init()
{
    nine[0]=1;
    for(int i=1;i<=n;i++)
    {
        nine[i]=nine[i-1]*0.9;
    }
}
double maxn(double a,double b)
{
    if(b-a>(1e-6))return b;
    else return a;
}
int main()
{
    cin>>n;
    init();
    for(int i=1;i<=n;i++)cin>>a[i];
    for(int i=1;i<=n;i++)
    {
        for(int j=1;j<=i;j++)
        {
            dp[i][j]=maxn(dp[i-1][j-1]*0.9+a[i],dp[i-1][j]);
        }
    }
    double ans=-1e10;
    for(int i=1;i<=n;i++)
    {
        ans=maxn(dp[n][i]/(10-10*nine[i])-(1200/sqrt(i)),ans);
    }
    cout<<fixed<<setprecision(15)<<ans<<endl;
    system("pause");
    return 0;
}
```



