---
title: 2024TJUACM第三讲——数论
abbrlink: 2753f524
date: 2024-01-20 19:25:51
tags:
  - 程序设计
  - C++
categories:
  - ICPC-CCPC
mathjax: true
---

讲讲数论

<!--more-->

# 数论基础$Numbers\,\, Theory$



## NT-1 质数相关

### 质数筛法：欧拉线性筛

算法原理：
$$
\begin{align}
&对于一个合数A进行质因数分解得到\\
\\
&A=\prod_{i=1}^{n}p_i^{k_i},p_1<p_2<...<p_n\\
\\
&对于素数筛去的时候，我们只要这个合数被最小的质数筛去\\
\\
&而在素数统计的时候，我们就是按照从小到大的顺序进行统计的\\
\\
&考虑埃氏筛法的过程，如果一个数是质数，那么他的倍数一定是合数；如果一个数是合数，那么其倍数依旧是合数\\
\\
&接下来证明欧拉线性筛是如何避免埃氏筛法中明显存在的重复筛去问题的。\\
\\
&在开始前需要先区分筛除素数倍数和用素数筛的区别。\\
\\
&对于一个发现的目标质数，我们要将其存储并筛掉其的所有倍数\\
\\
&首先就思考的是，筛倍数的时候为什么只筛素数倍？\\
\\
&显然，根据分解质因数定理易得，任何一个合数都会有一个最小素数将其筛除，筛素数倍就是分解质因数的逆过程\\
\\
&第二个问题，为什么只筛除比自己小的素数倍数？\\
\\
&设当前素数为p_0,如果筛除比自己大的素数倍数，设为p_1(即p_1筛除p_0倍)，\\
\\
&那么在筛p_1素数倍时会再次出现素数p_0筛除p_1倍。这样就会出现大量的重复。而且不符合用最小的素数筛除原则\\
\\
&第三个问题，为什么在筛i倍数时维护prime[j]\mid i时break? \\
\\
&首先i在此时肯定是合数，如果前面小的素数p_0出现了p_0\mid i,那么i必有i=p_0\times k,\\
\\
&此时p_0\times i=p_0 \times (p_0k),会在p_0k倍时被p_0筛除掉。\\
\\
&综上所述，线性性成立，时间复杂度O(n).\\
\\
&Q.E.D\\

\end{align}
$$

```
int prime[maxn];
bool vis[maxn];//初始0，标记合数
void euler(int n)
{
	for(int i=2;i<=n;i++)
	{
		if(!vis[i])prime[++prime[0]]=i;
		for(int j=1;j<=prime[0]&&i*prime[j]<=n;j++)
		{
			vis[i*prime[j]]=true;\\筛去合数
			if(i%prime[j]==0)break;
		}
	}
}
```

### 积性函数

#### 定义

若函数$f(n)$满足$f(1)=1$且$\forall x,y\in N^*,gcd(x,y)=1$都有$f(xy)=f(x)f(y)$，则$f(n)$​为积性函数。

特别的，若$\forall x,y\in N^*$都有$f(xy)=f(x)f(y)$​​​,则称作完全积性函数。



#### 性质

若$f(x)$和$g(x)$均为积性函数，那么下列函数也称作积性函数：
$$
\begin{align}
&h(x)=f(x^p)\\
&h(x)=f^p(x)\\
&h(x)=f(x)g(x)\\
&h(x)=\sum_{d\mid x}f(d)g(\frac{x}{d})\\
\end{align}
$$
设质因数分解$x=\prod_{i=1}^{n}p_i^{k_i}$，则

若$F(x)$为积性函数，则$F(x)=\prod_{i=1}^{n}f(p_i^k)$

若$F(x)$为完全积性函数，则$F(x)=\prod_{i=1}^{n}f(p_i^k)=\prod_{i=1}^{n}f^k(p_i)$​

（因为质数和其自己的$gcd$​并不是1而是其本身）



#### 常见积性函数

欧拉函数$\varphi(n)=\sum_{i=1}^{n}[gcd(i,n)=1]$.

除数函数$\sigma_k(n)=\sum_{d\mid n}d^k,k\in N.$

（特别的，$\sigma_0(n)$又记作$d(n)$，表示除数的个数。$\sigma_1(n)$又记作$\sigma(n)$​​，表示因数和）

二者均为非完全积性函数。

莫比乌斯函数

​       $\mu(p)=-1$​
$$
&\mu(n)=\left\{
\begin{aligned}
&\qquad 0\qquad \qquad n^{'}\;mod\;p1=0\\
&-\mu(n^{'})\qquad \quad otherwise
\end{aligned}
\right.
&n=p_1\cdot n^{'}
$$


#### 欧拉函数$\varphi(n)=\sum_{i=1}^{n}[gcd(i,n)=1]$

##### 通解公式

$$
\varphi(x)=x\prod_{i=1}^{n}(1-\frac{1}{p_i})\,\,\,\,,\,\,\,x=\prod_{i=1}^{n}p_i^{k_i}
$$

##### 性质

1. $\varphi(p)=p-1$
2. $\varphi(p^k)=p^{k-1}\varphi(p)$
3. 若$gcd(n,m)=1$，则$\varphi(nm)=\varphi(n)\varphi(m)$
4. 若$n\mid m$,则$\varphi(nm)=n\varphi(m)$​

仔细观察不难发现2是4的子集关系，故性质1、3、4称作欧拉函数三性质，简称欧拉函数性。



### 线性筛法求积性函数

假设一个积性函数$f$满足：对于任意的质数$p$和正整数$k$,可以在$O(1)$的时间内计算$f(p^k)$,那么可以在$O(n)$的时间内筛出$f(1),f(2),……,f(n)$的值。



设合数$n$的质因数分解为$\prod_{i=1}^{k}p_i^{k_i},p_i$单调递增,我们根据如下定义***最小质因子之幂***函数$g(n)$
$$
\begin{align}
若n可&以被x \cdot p_1 筛除，那么g(n)满足如下的递推式:\\
\\
&g(n)=\left\{
\begin{aligned}
&g(x) \cdot p_1 \quad iff \;\;x\;mod\;p=0\\
&p_1\qquad \;\;otherwise
\end{aligned}
\right.
\end{align}
$$
那么显然有如下式子必定成立：
$$
g(n)=p_1^{k_1}
$$
 若$n=g(n)$,则说明$n$就是某个质数的次幂，可以$O(1)$计算$f(n)$；否则，
$$
f(n)=f(\frac{n}{g_n})\;\cdot\;f(g_n)
$$

显然此时问题转化成了求某质数的最小质因子，而欧拉筛恰好就是根据这个过程来做到线性筛除的。

```;
int prime[maxn];
bool vis[maxn];
int f[maxn];
int g[maxn];
void euler(int n)
{
	g[0]=0;
	g[1]=0;
	for(int i=2;i<=maxn;i++)
	{
		if(!vis[i])
		{
			prime[++prime[0]]=i;
			g[i]=i;
		}
		for(int j=1;j<=prime[0]&&i*prime[j]<=n;j++)
		{
			vis[i*prime[j]]=true;//合数标记
			if(i%prime[j])
			{
				g[i*prime[j]]=g[i]*prime[j];
				break;
			}
			g[i*prime[j]]=prime[j];
		}
	}
}
int query(int x)
{
	if(x==g[x])return f[x];
	return query(x/g[x])*query(g[x]);
}
```

事实上，对于$f(p^k)$的计算很多时候不方便达到$O(1)$（比如说最经典的欧拉函数，其$\varphi(p^k)=p^{k-1}\varphi(p)$并没有那么的好计算，因为在线性筛法中不会特别的标注$n=p^k$的合数）。此时就可以通过欧拉函数性来进行简化操作。



换言之，如果一个积性函数能够满足以下三条性质：

1. $f(p)可O(1)查询$
2. 若$gcd(n,m)=1$，则$\varphi(nm)=\varphi(n)\varphi(m)$
3. 若$n\mid m$,则$\varphi(nm)可积性转移$（即递推公式只含有乘法）

则均可使用线性筛实现线性求解。



下列是欧拉函数筛法例子

```
int prime[maxn];
bool vis[maxn];//初始0，标记合数
int phi[maxn];
void euler(int n)
{
	for(int i=2;i<=n;i++)
	{
		if(!vis[i])prime[++prime[0]]=i,phi[i]=i-1;\\性质1
		for(int j=1;j<=prime[0]&&i*prime[j]<=n;j++)
		{
			vis[i*prime[j]]=true;\\筛去合数
			if(i%prime[j]==0)
			{
				phi[i*prime[j]]=prime[j]*phi[i];\\性质3
				break;
			}
			phi[i*prime[j]]=phi[prime[j]]*phi[i];\\性质2
		}
	}
}
```

下例是[$ABC342-Problem D$](https://atcoder.jp/contests/abc342/tasks/abc342_d)所需要的积性函数$f(x)$​
$$
函数f(x)表示x\cdot f(x)是平方数时的最小f(x)
$$
$e.g$
$$
f(1)=1\;,\;f(2)=2\;,\;f(4)=1\;,\;f(8)=2\;,\;f(10)=10 
$$
我们探寻其是否符合欧拉函数性。

1. $f(p)=p$，显然。因为不可能有更小的数满足条件了。
2. $f(mn)=f(m)\cdot f(n)\quad iff\quad gcd(m,n)=1$，$mn$互质没有公约数，只能各自配对成平方数后自行配对。
3. 若$n \mid m$，此时有$f(mn)=f(\frac{m}{n})$，积性化转移。

综上所述，可以使用欧拉筛解决。

```
#include<bits/stdc++.h>
using namespace std;
#define int long long
const int maxn=2e5+10;
int num[maxn],f[maxn],prime[maxn];
bool vis[maxn];
void init()
{
    f[0]=f[1]=1;
    for(int i=2;i<=2e5;i++)
    {
        if(!vis[i])
        {
            prime[++prime[0]]=i;
            vis[i]=1;
            f[i]=i;
        }
        for(int j=1;j<=prime[0]&&i*prime[j]<=2e5;j++)
        {
            vis[i*prime[j]]=1;
            if(i%prime[j]==0)
            {
                f[i*prime[j]]=f[i/prime[j]];
                break;
            }
            f[i*prime[j]]=f[i]*f[prime[j]];
        }
    }
    return;
}
int a[maxn];
signed main()
{
    init();
    int n;
    cin>>n;
    for(int i=1;i<=n;i++)cin>>a[i],num[a[i]]++;
    long long ans=0;
    for(int i=1;i<=2e5;i++)
    {
        if(!num[i])continue;
        for(int p=1;p<=450&&p*p*f[i]<=2e5;p++)
        {
            if(p*p*f[i]!=i)
            ans+=num[i]*num[p*p*f[i]];
        }
    }
    ans/=2;
    for(int i=0;i<=2e5;i++)
    {
        if(num[i]>1)
        ans+=num[i]*(num[i]-1)/2;
    }
    ans+=num[0]*(n-num[0]);
    cout<<ans<<endl;
    system("pause");
    return 0;
}
```




## NT-2 约数相关

### 最大公约数$gcd(a,b)$:

欧几里得算法

```
int gcd(int x,int y)
{return y==0? x : gcd(y,x%y); }
```

大整数求模运算时间复杂度过高，建议换用更相减损术（最坏情况$O(n)$)。

```
int gcd(int x,int y)
{
	if(x>y)swap(x,y);
	return y==0?x:gcd(y,y-x);
}
```

对于a远大于b的情况，对更相减损术使用Stein算法优化：

若$(2\mid a) \and (2\mid b)$则有$gcd(a,b)=2gcd(\frac{a}{2},\frac{b}{2})$​

否则若$2 \mid a$,则有$gcd(a,b)=gcd(\frac{a}{2},b)$​

否则若$2 \mid b$,则有$gcd(a,b)=gcd(a,\frac{b}{2})$

否则$gcd(a,b)=gcd(a,b-a)$​



### 最小公倍数$lcm(a,b)$

最小公倍数算法


$$
gcd(a,b) \times lcm(a,b) =a \times b
$$



### 扩展欧几里得算法 $Exgcd$​​

求解方程$ax+by=gcd(a,b)$的一组可行解。

算法原理：
$$
\begin{align}
&设方程的一组可行解为(x_1,y_1),则有\\
\\
&ax_1+by_1=gcd(a,b)\\
\\
&又因为bx_2+(b\,mod\,a)y_2=gcd(b,a\,mod\,b)\\
\\
&所以ax_1+by_1=bx_2+(b\,mod\,a)y_2\\
\\
&由于(a\,mod\,b)=a-b\times\lfloor\frac{b}{a}\rfloor\\
\\
&故有方程\\
\\
&\qquad  ax_1+by_1=bx_2+ay_2-by_2\times\lfloor\frac{b}{a}\rfloor\\
\\
&化简有
\\
&\qquad ax_1+by_1=ay_2+b(x_2-\lfloor\frac{a}{b}\rfloor y_2)\\
\\
&所以有
\left\{
\begin{aligned}
&x_1=y_2\\
&y_1=x_2-\lfloor\frac{a}{b}\rfloor y_2\\
\end{aligned}
\right.
\end{align}
$$

```
void exgcd(int a,int b,int &x,int &y)
{
	if(!b)
	{
		x=1;y=0;return;
	}
	exgcd(b,a%b,x,y);
	int t=y;
	y=x-(a/b)*y;
	x=t;
	return;
}
```

此时求解到的$x$和$y$为一组特解$x^{'}，y^{'}$。一般的该方程的解系为
$$
\left\{
\begin{aligned}
x=x^{'}+k\frac{b}{gcd(a,b)}&\\
\\&,k\in Z\\
y=y^{'}-k\frac{a}{gcd(a,b)}\\
\end{aligned}
\right.
$$



### 裴蜀定理

$$
\begin{align}
&设不全为0的整数a,b，对于任意整数x,y有\\
\\
&\qquad gcd(a,b)|(ax+by)\\
\\
&且一定存在整数解x_0,y_0使得下列方程成立\\
\\
&\qquad ax_0+by_0=gcd(a,b)

\end{align}
$$

## NT-3 同余相关

### 费马小定理与欧拉定理

#### 费马小定理

$$
对于任意正整数a，\exist p满足gcd(a,p)=1,则必然有以下同余式成立:\\
a^{p-1} \equiv1\ (mod \; n)
$$

##### 证明

$$
设一个和a互质的质数为p，勒令集合A=\left\{1,2,……,p-1\right\}.(p的完全剩余系)\\
\\
由于gcd(a,p)=1,gcd(A_i,p)=1\\
\\
那么显然\forall i\in [1,p-1],gcd(A_i\times a,p)=1\\
\\
进一步的，则必然有:\\
\\
\forall i\in[1,p-1],\;\nexists j\neq i\;,使得aA_i\equiv aA_j\ (mod\ p)\\
\\
(\ a(A_j-A_i)\ mod\ p=0 \Rightarrow (A_j-A_i)\ mod \ p=0 \Rightarrow A_j=A_i\ )\\
\\
(同余系的互质倍数亦为同余系)\\
\\
那么显然会有以下的内容成立:\\
\prod_{i=1}^{n(n\leq p-1)}A_i \equiv \prod_{i=1}^{n(n\leq p-1)}(A_i \times a)\;mod\;p\\
\\
记f=(p-1)!\; ,则\\
\\
f\equiv a^{p-1}\prod_{i=1}^{p-1}A_i\ (mod\ p)\\
\\
f\equiv a^{p-1}f\ (mod\ p)\\
\\
1\equiv a^{p-1}\ (mod\ p)\\
\\
a^p\equiv a\ (mod\ p)\\
\\
Q.E.D\\
$$

#### 欧拉定理

$$
对任意正整数a、m，若gcd(a,m)=1，则有\\
\\
a^{\varphi(m)}\equiv1\ (mod\ m)\\
\\
$$

证明：
