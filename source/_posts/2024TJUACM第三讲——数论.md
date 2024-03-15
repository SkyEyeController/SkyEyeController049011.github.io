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

$$
\begin{align}\mu(n)=\left\{
\begin{aligned}
&\quad \ -1\qquad \quad \ \ iff\ \ n\ is\ a\ prime \\
&\qquad 0\qquad \qquad n^{'}\;mod\;p1=0\\
&-\mu(n^{'})\qquad \quad otherwise
\end{aligned}
\right.
&,n=p_1\cdot n^{'}
\end{align}
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

对于$a$远大于$b$的情况，对更相减损术使用Stein算法优化：

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
	exgcd(b,a%b,y,x);
	y-=(a/b)*x;
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
(剩余系的互质倍数亦为剩余系)\\
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



[关于剩余系、完全剩余系、简化（既约）剩余系、同余类的概念]([剩余类、剩余系、完全剩余系和简化剩余系学习笔记 - olderciyuan - 博客园 (cnblogs.com)](https://www.cnblogs.com/olderciyuan/p/15500681.html))



#### 欧拉定理

$$
对任意正整数a、m，若gcd(a,m)=1，则有\\
\\
a^{\varphi(m)}\equiv1\ (mod\ m)\\
\\
$$

##### 证明：

$$
设集合A=\left\{r_1,r_2,……,r_{\varphi(m)}\right\}为模m下的一个简化剩余系，那么易得\\
\\
\left\{ar_1,a_2,……,ar_{\varphi(m)} \right\}同样是一个简化剩余系\\
\\
则根据费马小定理的证明方法有\\
\\
f=\prod_{i=1}^{\varphi(m)}r_i\\
\\
f\equiv a^{\varphi(m)}f\ (mod\ m)\\
\\
1\equiv a^{\varphi(m)}\ (mod\ m)\\
\\
Q.E.D
$$



##### 欧拉定理与扩展欧拉定理

$$
a^b\equiv 
\left \{
\begin{aligned}
&a^{b\ mod\ \varphi(m)}\qquad \qquad gcd(a,m)=1\\
&a^b \qquad\qquad\qquad\quad\ gcd(a,m)\neq1,b<\varphi(m)\\
&a^{(b\ mod\ \varphi(m))+\varphi(m)} \quad \ gcd(a,m)\neq1,b\geq\varphi(m)
\end{aligned}
\right.\quad (mod\ m)
$$



[证明](https://zhuanlan.zhihu.com/p/131536831)，$Q.E.D$

扩展欧拉定理应用于对超大整数快速幂求模的优化降幂运算，来大幅度降低时间复杂度

```
#define int long long
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
int qpow(int a, int n, int MOD) // 快速幂
{
    int ans = 1;
    while (n)
    {
        if (n & 1)
            ans =  ans * a % MOD; 
        n >>= 1;
        a =  a * a % MOD;
    }
    return ans;
}
int Ex_euler_T(int a,int n)
{
	if(__gcd(a,MOD)==1)
	{
		return qpow(a,b%phi[m]);
	}
	else
	{
		if(b<phi[m])
		{
			return qpow(a,b);
		}
		return qpow(a,(b%phi[m])+phi[m]);
	}
}
#undef int
```

#### 乘法逆元

如何求解分数的模？换言之，已知$gcd(a,b)=1$，如何求$a^{-1}\ mod\ b$?

1. 扩展欧几里得定理求解

   方程极易转化为$ax\equiv 1\ (mod\ b)$，依据扩展欧几里得公式迅速求解。

   ```
   int exgcd(int a,int b int &x,int &y)
   {
   	if(b==0)
   	{
   		x=1;y=0;return;
   	}
   	exgcd(b,a%b,x,y);
   	int t=y;
   	y=x-(a/b)y;
   	x=t;
   }
   ```

   一般的我们需要最小的正整数解：
   $$
   x=(x^{'}mod\ b\ +b)mod\
   $$
   

   ```
   int invq(int a,int mod)
   {
   	int x,y;
   	exgcd(a,mod,x,y);
   	return (x%mod+mod)%mod;
   }
   ```

   

2. 费马小定理求解

   这个是最常用的，一般题目都会让对质数求模。

   ```
   int invq(int a)
   {
   	return quickpow(a,mod-2);
   }
   ```

   逆元运算是分数意义的求模，在整数域定义了实数意义上的倒数运算，其基本性质和倒数没有区别。根据此可由前缀积实现线性求$n$个数的逆元。

#### 线性同余方程

$$
ax\equiv b\ (mod\ m)\\
$$

解方程：
$$
x\equiv ba^{-1}\ (mod\ m)
$$

#### 威尔逊定理



## NT-S-1 线性同余方程组与中国剩余定理 

### 中国剩余定理$Chinese\ Remainder\ Theorem$

今有物不知几何，三三数之剩二，五五数之剩三，七七数之剩二，问物几何？



### 中国剩余定理与线性同余方程组

#### 数学抽象

一般的，中国剩余定理可以求解如下线性同余方程组
$$
\left\{\begin{aligned}
&x\equiv a_1\ (mod\ n_1)\\
&x\equiv a_2\ (mod\ n_2)\\
&\quad\vdots\\
&x\equiv a_k\ (mod\ n_k)\\
\end{aligned}\right.
$$


其中所有$n_i$互质。

#### 求解过程

1. 计算$N=\prod_{i=1}^kn_i$
2. 对于第$i$个方程:
   1. 计算$m_i=\frac{N}{n_i}$
   2. 计算$m_i^{-1}\ (mod\ n_i)$
   3. 计算$c_i=m_i\cdot m_i^{-1}$，不取模。
3. 方程组在模$n$​意义下唯一解为

$$
x=\sum_{i=1}^ka_i\cdot c_i
$$

#### 证明

$$
\begin{aligned}
&\begin{aligned}
x&=\sum_{i=1}^ka_i\cdot c_i\\
&=\sum_{i=1}^{k}a_i\cdot m_i\cdot m_i^{-1}\\
\\
\end{aligned}\\

&\begin{aligned}
&当i\neq j时，m_i\equiv 0\ (mod\ n_j)\\
\\
&故有\\
\end{aligned}\\
\\
&\begin{aligned}
x&\equiv a_j\cdot m_j\cdot m_j^{-1}\ (mod\ n_j)\\
&\equiv a_j\ (mod\ n_j)\\
\end{aligned}\\
\\
&Q.E.D
\end{aligned}
$$

#### 实现

```
#include <bits/stdc++.h>
using namespace std;
#define int long long
void Exgcd(int a, int b, int &x, int &y)
{
    if (b == 0)
    {
        x = 1, y = 0;
        return;
    }
    Exgcd(b, a % b, y, x);
    y -= (a / b) * x;
    return;
}
const int maxn = 101;
int m;
int n[maxn], a[maxn]; // 对a取模余数是b
signed main()
{
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);
    cin >> m;
    int N = 1;
    for (int i = 1; i <= m; i++)
    {
        cin >> n[i] >> a[i];
        N *= n[i];
    }
    int ans = 0;
    for (int i = 1; i <= m; i++)
    {
        int tar = N / n[i];
        int x, y;
        Exgcd(tar, n[i], x, y);
        x = (x % n[i] + n[i]) % n[i];
        (ans += ((tar * x) % N * (a[i] % N))) %= N;
    }
    cout << (ans + N) % N << endl;
    system("pause");
    return 0;
}
```



### 扩展中国剩余定理与扩展欧几里得定理

$$
\left\{\begin{aligned}
&x\equiv a_1\ (mod\ m_1)\\
&x\equiv a_2\ (mod\ m_2)\\
&\quad\vdots\\
&x\equiv a_k\ (mod\ m_k)\\
\end{aligned}\right.
$$

此时$m_i$之间不保证两两互质，无法使用中国剩余定理的逆元方法求解。

#### 求解方法

任取两组方程
$$
\left\{\begin{aligned}
&x\equiv a_i\ (mod\ m_i)\\
&x\equiv a_j\ (mod\ m_j)\\

\end{aligned}\right.
$$
设此时方程组某个解为$x=m_ik_i+a_i=m_jk_j+a_j$（$k_i、k_j\in Z$​，不保证必须为质数）

那么可以将等式转化为
$$
m_ik_i-m_jk_j=a_j-a_i
$$
根据裴蜀定理，如果$gcd(m_i,m_j)\nmid a_j-a_i$，那么此时该方程无解,同余方程组无解。

否则可计算出
$$
m_{i^{'}}k_i+m_{j^{'}}k_j=\frac{a_j-a_{i}}{gcd(m_i,m_j)}
$$
其中$gcd(m_{i^{'}},m_{j^{'}})=1$，再次应用裴蜀定理
$$
m_{i^{'}}k_{i^{'}}+m_{j^{'}}k_{j^{'}}=1
$$


$Exgcd$求解之后得到***特解 $k_{i^{'}}$​（注意，可能是负的）***
$$
k_i=k_{i^{'}}\frac{a_j-a_{i}}{gcd(m_i,m_j)}
$$
组合得到新同余方程
$$
x\equiv m_ik_i+a_i\ (mod\ lcm(m_i,m_j))
$$
如上应用$n-1$​次扩展欧几里得定理之后即可得到同余方程组结果。

#### 快速乘

需要注意的是，在线性同余方程组求解中，$\frac{a_j-a_{i}}{gcd(m_i,m_j)}$可能会非常的大以至于爆破$long\ long$，而且计算机做加法的速度远快于做乘法。所以需要类比快速幂使用快速乘法。需要注意的是，在本题特殊环境下，可能出现负数的快速乘，需要对模化成正数解决。

```
#define int long long
int quickmul(int a,int b,int mod)
{
    int e=0;
    while(b)
    {
        if(b&1)(e+=a)%=mod;
        (a<<=1)%=mod;
        b>>=1;
    }
    return e;
}
#undef int
```

#### 解决方案

```
#include <bits/stdc++.h>
using namespace std;
#define int long long
int quickmul(int a, int b, int mod)
{
    while (a < 0)
        a += mod;
    while (b < 0)
        b += mod;
    if (a < b)
        swap(a, b);
    int e = 0;
    while (b)
    {
        if (b & 1)
            (e += a) %= mod;
        (a <<= 1) %= mod;
        b >>= 1;
    }
    return e;
}
void exgcd(int a, int b, int &x, int &y)
{
    if (b == 0)
    {
        x = 1, y = 0;
        return;
    }
    exgcd(b, a % b, y, x);
    y -= (a / b) * x;
}
const int maxn = 500001;
int a[maxn], m[maxn]; // 对m取模余数是a
int n;
int ExCRT()
{
    int mod = m[1], ans = a[1];
    for (int i = 2; i <= n; i++)
    {
        int b1 = mod, b2 = m[i], c = __gcd(b1, b2), minus = (a[i] - ans % b2 + b2) % b2;
        if (minus % c != 0)
            return -1;
        b1 /= c, b2 /= c, minus /= c;
        int x, y;
        exgcd(b1, b2, x, y);
        x = quickmul(x, minus, b2);
        ans += x * mod;
        mod *= b2;
        ans = (ans % mod + mod) % mod;
    }
    return ans;
}
signed main()
{
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);
    cin >> n;
    for (int i = 1; i <= n; i++)
    {
        cin >> m[i] >> a[i];
    }
    cout << ExCRT() << endl;
    system("pause");
    return 0;
}
```

## NT-S-2 卢卡斯定理与扩展卢卡斯定理

#### 卢卡斯定理$Lucas\ Theorem$​

##### 内容

$$
对于质数p，有如下等式成立:\\
\left(
\begin{aligned}
&n\\
&m\\
\end{aligned}
\right)\ mod\ p=
\left(
\begin{aligned}
&n\ mod\ p\\
&m\ mod\ p\\
\end{aligned}
\right)\cdot\left(
\begin{align}
&\lfloor \frac{n}{p}\rfloor\\
&\lfloor \frac{m}{p}\rfloor
\end{align}
\right)\ mod\ p
$$

亦或写作
$$
C_n^{m}\ mod\ p=C_{\lfloor \frac{n}{p}\rfloor}^{\lfloor \frac{m}{p}\rfloor}\cdot C_{n\ mod\ p}^{m\ mod\ p}\ mod \ p
$$
注意到$C_{\lfloor \frac{n}{p}\rfloor}^{\lfloor \frac{m}{p}\rfloor}$可能依旧很大，可继续使用卢卡斯定理递归求解。边界条件为$m=0$返回$1$.

```
long long C(long long n,long long m,long long mod)
{
	if(m>n&&n==0)return 0;
	if(m==0)return 1;
	return ((frac[n]*invq[m]%mod)*invq[n-m])%mod;
}
//阶乘的值和逆元预处理是线性的递推
long long Lucas(long long n, long long m, long long p)
{
    if (m == 0)
        return 1;
    return (C(n % p, m % p, p) * Lucas(n / p, m / p, p)) % p;
}
```

##### 证明

[$Q.E.D$](https://oi-wiki.org/math/number-theory/lucas/#证明)

#### 扩展卢卡斯定理$Extend\ Lucas\ Theorem$

