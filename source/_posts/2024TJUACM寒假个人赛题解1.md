---
title: 2024TJUACM寒假个人赛题解1
tags:
  - 程序设计
  - C++
categories:
  - ICPC-CCPC
mathjax: true
abbrlink: 2ae78ea2
date: 2024-01-14 19:29:35
---

个人赛集训的第一天，题目来源为$Codeforces$ $Round$ $806$和$2023TJUACM$集训队自命题

群魔乱舞的第一天。

<!--more-->

# TJ-1 [奇怪的循环](https://acm.tju.edu.cn/problem/2023TJUACM9.15-A)

## 题目大意：

找出$\frac{1}{9801}$小数点后的第n位。

## 题目解析：

属实是被阴了一把，比赛时没有老老实实地打高精度（其实也用不着），摸了一把计算器发现直接00、01、02、03、……规律下去了就直接暴力规律结果WA了三四发，老老实实拍了高精度板子发现我超，96979900，98被吃了不会出现……

鉴于题目属实太水了点，主要复习一下高精度的板子问题。

## 题目拓展

高精度除法，前提是高精度减法和高精度乘法，目的是求出两个大整数的商以及余数。

这里的板子是最朴素的模拟，大面积的使用string类，乘法速度较慢，而且受限于高精加。暂时插个眼等数学之后快速傅里叶变换的高精度乘法

```
#include <bits/stdc++.h>
using namespace std;
class MyInteger
{
private:
    string bignum;
    struct calcpro
    {
        // compare比较函数：相等返回0，大于返回1，小于返回-1
        int compare(string str1, string str2)
        {
            if (str1.length() > str2.length())
                return 1;
            else if (str1.length() < str2.length())
                return -1;
            else
                return str1.compare(str2);
        }
        //高精度加法
        //只能是两个正数相加
        string add(string str1, string str2) //高精度加法
        {
            string str;
            int len1 = str1.length();
            int len2 = str2.length();
            //前面补0，弄成长度相同
            if (len1 < len2)
            {
                for (int i = 1; i <= len2 - len1; i++)
                    str1 = "0" + str1;
            }
            else
            {
                for (int i = 1; i <= len1 - len2; i++)
                    str2 = "0" + str2;
            }
            len1 = str1.length();
            int cf = 0;
            int temp;
            for (int i = len1 - 1; i >= 0; i--)
            {
                temp = str1[i] - '0' + str2[i] - '0' + cf; //逐位计算,A+B+进位
                cf = temp / 10;                            //该位计算进位确认
                temp %= 10;                                //该位计算结果确认
                str = char(temp + '0') + str;              //该位计算结果存储
            }
            if (cf != 0)
                str = char(cf + '0') + str;
            return str;
        }
        //高精度减法
        //只能是两个正数相减，而且要大减小
        string sub(string str1, string str2) //高精度减法
        {

            string str;
            int tmp = str1.length() - str2.length();
            int cf = 0;
            for (int i = str2.length() - 1; i >= 0; i--)
            {
                if (str1[tmp + i] < str2[i] + cf)
                {
                    str = char(str1[tmp + i] - str2[i] - cf + '0' + 10) + str;
                    cf = 1;
                }
                else
                {
                    str = char(str1[tmp + i] - str2[i] - cf + '0') + str;
                    cf = 0;
                }
            }
            for (int i = tmp - 1; i >= 0; i--)
            {
                if (str1[i] - cf >= '0')
                {
                    str = char(str1[i] - cf) + str;
                    cf = 0;
                }
                else
                {
                    str = char(str1[i] - cf + 10) + str;
                    cf = 1;
                }
            }
            str.erase(0, str.find_first_not_of('0')); //去除结果中多余的前导0
            return str;
        }
        //高精度乘法
        //只能是两个正数相乘
        //速度更慢，因为涉及了高精度加法的调用
        string mul(string str1, string str2)
        {
            string str;
            int len1 = str1.length();
            int len2 = str2.length();
            string tempstr;
             
            for (int i = len2 - 1; i >= 0; i--)
            {
                tempstr = "";
                int temp = str2[i] - '0';
                int t = 0;
                int cf = 0;
                if (temp != 0)
                {
                    for (int j = 1; j <= len2 - 1 - i; j++)
                        tempstr += "0";
                    for (int j = len1 - 1; j >= 0; j--)
                    {
                        t = (temp * (str1[j] - '0') + cf) % 10;
                        cf = (temp * (str1[j] - '0') + cf) / 10;
                        tempstr = char(t + '0') + tempstr;
                    }
                    if (cf != 0)
                        tempstr = char(cf + '0') + tempstr;
                }
                str = add(str, tempstr);
            }
            str.erase(0, str.find_first_not_of('0'));
            return str;
        }
        //高精度除法
        //两个正数相除，商为quotient,余数为residue
        //需要高精度减法和乘法，无法加快。
        void div(string str1, string str2, string &quotient, string &residue)
        {
            quotient = residue = ""; //清空
            if (str2 == "0")         //判断除数是否为0
            {
                quotient = residue = "ERROR";
                return;
            }
            if (str1 == "0") //判断被除数是否为0
            {
                quotient = residue = "0";
                return;
            }
            int res = compare(str1, str2);
            if (res < 0)
            {
                quotient = "0";
                residue = str1;
                return;
            }
            else if (res == 0)
            {
                quotient = "1";
                residue = "0";
                return;
            }
            else
            {
                int len1 = str1.length();
                int len2 = str2.length();
                string tempstr;
                tempstr.append(str1, 0, len2 - 1);
                for (int i = len2 - 1; i < len1; i++)
                {
                    tempstr = tempstr + str1[i];
                    tempstr.erase(0, tempstr.find_first_not_of('0'));
                    if (tempstr.empty())
                        tempstr = "0";
                    for (char ch = '9'; ch >= '0'; ch--) //试商
                    {
                        string str, tmp;
                        str = str + ch;
                        tmp = mul(str2, str);
                        if (compare(tmp, tempstr) <= 0) //试商成功
                        {
                            quotient = quotient + ch;
                            tempstr = sub(tempstr, tmp);
                            break;
                        }
                    }
                }
                residue = tempstr;
            }
            quotient.erase(0, quotient.find_first_not_of('0'));
            if (quotient.empty())
                quotient = "0";
        }
    } sky;
    string rest;

 public:
    MyInteger()
    {
        bignum = "0";
    } //默认构造很熟构造函数, 默认值为0
    MyInteger(string &num)
    {
        /*int o = 0;
        int i;
        for (i = 0; i < num.size(); i++)
        {
            if (num[i] != 0)
                break;
        }
        for (i, o; i < num.size(); i++, o++)
        {
            bignum[o] = num[i];
        }*/
        bignum=num;
    } // 构造函数，从字符符串构造为大整数。
    MyInteger(int num)
    {
        char a[101];
        memset(a, 0, sizeof(a));
        sprintf(a, "%d", num);
        for (int i = 0; i < strlen(a); i++)
            bignum.at(i) = a[i];
    }               // 构造函数，从整型构造为大整数。
    ~MyInteger(){}; // 析构函数
    string getnum()
    {
        return bignum;
    } // 返回表示大整数的字符字符串，注意去除前导零。//除法部分不完善。
    MyInteger operator+(const MyInteger &bint2)
    {
        MyInteger sum;
        sum.bignum = sky.add(bignum, bint2.bignum);
        return sum;

    } //大整数加法
    MyInteger operator-(const MyInteger &bint2)
    {
        MyInteger minus;
        minus.bignum = sky.sub(bignum, bint2.bignum);
        return minus;

    } //大整数减法
    MyInteger operator*(const MyInteger &bint2)
    {
        MyInteger multiplyer;
        multiplyer.bignum = sky.mul(bignum, bint2.bignum);
        return multiplyer;
    } //大整数乘法
    MyInteger operator/(const MyInteger &bint2)
    {
        MyInteger divisioner;
        sky.div(bignum, bint2.bignum, divisioner.bignum, divisioner.rest);
        return divisioner;
    }
};
```
## 插个眼：快速傅里叶变换FTT实现高精度乘法（洛谷板子）

# TJ-2 [买剑](https://acm.tju.edu.cn/problem/2023TJUACM10.5-A)

## 题目大意 ：

给定一串数列，从中随机选取两个，求能使两个数之和为某一给定值的情况总数。注意，数列中有重复数字，一个数字只能选取一次。

## 题目分析：

map搞定，注意，如果选择的两个数字相同的时候，结果需要减一，因为存储的b-s[i]=s[i],那在map中查找时map[d-s[i]]会把s[i]自己又算一遍，变相的是将自己取了两次。这个数据是通过
```
4 4
1 1 1 1
//结果应该为6，如果不注意上述问题输出的是8
```
发现。

## AC代码：
```
#include<bits/stdc++.h>
using namespace std;
#define int long long
long long a,b;
long long s[2000001];
map<long long,long long>mp;
signed main()
{
    cin>>a>>b;
    for(int i=1;i<=a;i++)
    {
        cin>>s[i];
        mp[s[i]]++;
    }
    if(b&1)
    {
        cout<<0<<endl;
        system("pause");
        return 0;
    }
    b/=2;
    long long ans=0;
    for(int i=1;i<=a;i++)
    {
        ans+=mp[b-s[i]];
        if(2*s[i]==b)ans--;
    }
    cout<<ans/2<<endl;
    system("pause");
    return 0;
}
```
## 题目扩展：关于unordered_map和map的时空复杂度的讨论

很多时候会出现map被卡时间复杂度而umap不被卡；或者unmap被卡map不卡的问题，这里总数讨论一下。

$map$(底层逻辑为红黑树，和set同源)：

优点：

$map$元素有序（这是$map$最大的优点，其元素的有序性在很多应用中都会简化很多的操作）；

其红黑树的结构使得$map$的很多操作都可在$O(logn)$下完成；

$map$的各项性能较为稳定，与元素插入顺序无关；

$map$支持范围查找。

缺点：

占用的空间大：红黑树的每一个节点需要保存其父节点位置、孩子节点位置及红/黑性质，因此每一个节点占用空间大。

查询平均时间不如$unordered$ _ $map$,但是比后者稳定太多。

适用场景：

元素需要有序；

对于单次查询时间较为敏感，必须保持查询性能的稳定性，比如实时应用等等。

$unordered$ _ $map$

优点：

查询速度快，平均性能接近于常数时间$O(1)$，但是最坏情况极其难以承受；

缺点：

元素无序；

$unordered$ _ $map$相对于$map$空间占用更大，且其利用率不高；
查询性能不太稳定，最坏时间复杂度可达到O(n)。

适用场景：

要求查找速率快，且对单次查询性能要求不敏感。

结语
$map$和$unordered$ _ $map$并无好坏之分，它们都有各自应用的场景。它们之间的区别归根结底来源于使用的数据结构不同。

最后一句话，总结一下它们的适用场景：

在需要元素有序性或者对单次查询性能要求较为敏感时（通常情况下），请使用$map$，其余情况下应使用$unordered$ _ $map$。

在需要使用字典结构进行算法编程的大部分情况下，都需要使用$unordered$ _ $map$而不是$map$。

# CF-1 [Yet Another Problem About Pairs Satisfying an Inequality](https://codeforces.com/problemset/problem/1703/F)

## 题目大意:

给定一串序列$a_1,a_2,…,a_n$,求出满足$a_i<i<a_j<j$的数对$(i,j)$总数。

## 题目分析:

赛场上想麻烦了，不过也不失为一个好的思路。
先说正解,前缀和，前缀统计$[1,i)$前面满足不等式$a_k<k$的下标总数累加

```
long long ans = 0;//开long long 不然爆炸
for (int i = 1; i <= n; i++)
{
	cin >> a[i];
	b[i] = b[i - 1] + (a[i] < i);//如果满足a[i]<i那么就前缀和就加1
	if (a[i] < i && a[i] - 1 >= 1)//判断同时防止越界
	{
		ans += b[a[i] - 1];//从1开始到a[i]满足的对数，b[i]数组是满足对数的前缀和。
	}
		
}
cout << ans << endl;
```
考试的时候是这么想的，将所有满足条件的数对$(a_k,k)$扔到一个$vector$里，通过树状数组实现$a_i<j$配对求和。

咋说呢，差不多，但是代码体量复杂了很多，时间复杂度也优化了不是特别多，属于常数级别优化？

管他呢，确实跑过去了（）

```
#include <bits/stdc++.h>
using namespace std;
#define int long long
typedef pair<int, int> p;
const int maxn = 4e5 + 10;
int tree[maxn];
int lowbit(int x)
{
    return x & (-x);
}
void add(int i, int x)
{
    for (int pos = i; pos < maxn; pos += lowbit(pos))
    {
        tree[pos] += x;
    }
}
int sum(int x)
{
    if(x<=0)return 0;
    int ans = 0;
    for (int pos = x; pos; pos -= lowbit(pos))
    {
        ans += tree[pos];
    }
    return ans;
}
signed main()
{
    int t;
    cin >> t;
    while (t--)
    {
        int n;
        cin >> n;
        vector<p> num;
        memset(tree,0,sizeof(tree));
        for (int i = 1; i <= n; i++)
        {
            int tem;
            cin >> tem;
            if (tem < i)
            {
                num.push_back({tem, i});
                add(i,1);
            }
        }
        int ans=0;
        int cnt=num.size();
        for(int i=0;i<cnt;i++)
        {
            ans+=sum(num[i].first-1);
        }
        cout<<ans<<endl;
    }
    system("pause");
    return 0;
}
```

# CF-2 [Good Key, Bad Key](https://codeforces.com/contest/1703/problem/G)

## 题目大意：

开坎诺特的箱子需要钥匙代价。好的钥匙要花钱，但能得到全部源石锭；坏钥匙不花钱，但是所有未打开宝箱（包括当前将打开的宝箱）内源石锭数目减半（向下取整），求你按顺序打开宝箱最多能获得多少源石锭。

## 题目解析

需要注意一点，1e9的数据范围证明int类型，那么最多使用31把坏钥匙之后，宝箱内将不在有源石锭（都变成0了），往后不管是否在使用坏钥匙都不会再新获得源石锭，相反使用好钥匙还会倒贴源石锭。

第i个宝箱内有多少源石锭受其之前使用钥匙影响；子问题递归影响且无后效性。

故列出动态规划方程

设$dp[i][j]$表示$1$~$i$号宝箱使用$j$把坏钥匙情况下所获得最多源石锭，则
$$
dp[i][j]=max(dp[i-1][j]-k,dp[i-1][j-1])+(a[i]>>j);
$$
最后依次暴力dp[n][i]找出最大值。

## AC 代码

```
#include<bits/stdc++.h>
using namespace std;
const int maxn=1e5+1;
int dp[maxn][33];
int a[maxn];
int main()
{
    int t;
    cin>>t;
    while(t--)
    {
        int n,k;
        cin>>n>>k;
        memset(dp,0,sizeof(dp));
        for(int i=1;i<=n;i++)
        {
            cin>>a[i];
        }
        for(int i=1;i<=n;i++)
        {
            for(int j=0;j<=min(i,32);j++)
            {
                if(j==0)dp[i][j]=dp[i-1][j]+a[i]-k;
                else dp[i][j]=max(dp[i-1][j]-k,dp[i-1][j-1])+(a[i]>>j);
            }
        }
        int ans=-0x3f3f3f;
        for(int i=0;i<=32;i++)
        {
            ans=max(dp[n][i],ans);
        }
        cout<<ans<<endl;

    }
    system("pause");
    return 0;
}
```
