### LINKVIEW2 是什么
LINKVIEW2 是一个对 DNA 比对（alignments）进行可视化的工具，包含一个命令行工具和一个图形化界面。有助于生物信息学研究人员快速地将比对结果进行可视化。支持多种比对格式，包括 blast、minimap2、MUMmer 软件的输出结果，以及 LINKVIEW2 专属格式。支持多种绘图风格，自定义比对块颜色、highlight 某段区间、自定义比例尺，自定义绘图布局、绘制基因结构等功能。




### 安装
1. 安装 Node.js

   LINKVIEW2 基于 Node.js 安装，在安装和使用 LINKVIEW2 前，您需要安装 Node.js。

   - 在 Mac 上安装 Node.js

     ```shell
     brew install node
     ```

   - 在 linux 上安装 Node.js
   
     ```shell
     cd /path/to/your/sortware_dir/
     wget https://nodejs.org/dist/v14.15.0/node-v14.15.0-linux-x64.tar.xz
     tar xf node-v14.15.0-linux-x64.tar.xz
     cd node-v14.15.0-linux-x64/bin/
     pwd | awk '{print "echo \"export PATH=" $0 ":\\$PATH \" >> ~/.bashrc"}' | sh
     source ~/.bashrc
     ```
   
   运行命令`node -v`和`npm -v`能看到版本信息，则说明 Node.js 安装成功。
   
   
   
2. 安装 LINKVIEW2 命令行工具

   ```shell
   npm install -g  @linkview/linkview-cli
   ```
   
   如果卡在安装 `sharp` 那一步，请稍作等待，也可以尝试使用 cnpm 源：
   
   ```shell
   npm i -g @linkview/linkview-cli --registry=http://r.cnpmjs.org/
   ```
   
   运行命令`LINKVIEW2 --version`，如果能看到版本信息，则说明安装成功。
   
   

### LINKVIEW2 入门教程
本章将带您通过不同的例子，熟悉 LINKVEW2 的用法。



#### Case1
1. 新建文件 `alignments.txt`, 内容如下

   ```
   ctg1 1 100 ctg2 1 100
   ctg1 101 120 ctg2 120 101 red
   ctg2 121 150 ctg1 121 150 yellow:0.2
   ```
   
2. 运行命令 `LINKVIEW2 alignments.txt`, 您将得到如下图片
   ![](https://github.com/YangJianshun/LINKVIEW2/blob/master/packages/linkview-cli/doc/images/case1.png?raw=true)

   [在LINKVIEW-GUI中尝试](https://yangjianshun.github.io/LINKVIEW2/?inputContent=ctg1%201%20100%20ctg2%201%20100%0actg1%20101%20120%20ctg2%20120%20101%20red%0actg2%20121%20150%20ctg1%20121%20150%20yellow:0.2&autoSubmit)

   
   
   解释：
   
   `alignments.txt`文件中存储了要展示的比对信息，每一行一条比对，第一行 `ctg1 1 100 ctg2 1 100` 表示序列 ctg1 的第 1 到 100 bp 比对到了 ctg2 的第 1 到 100 bp。第二行表示 ctg1 的 101 到 120 bp 对应于 ctg2 的 120 到 101 bp，是一个反向互补的比对，最后一列 `red` 表示绘制这个 alignment 的颜色。第三列同理，最后一列 `yellow:0.2`表示已黄色绘制，透明度为0.2。
   
   这种文件格式是 LINKVIEW2 专属的比对格式，可以指定绘制的颜色和透明度，文件格式为：
   
   ```
   seq1 start1 end1 seq2 start2 end2 [color:opacity]
   ```



#### Case2

1. 新建文件 `alignments.txt`, 内容如下：

   ```
   ctg1 1 100 ctg2 1 100
   ctg1 1 100 ctg3 100 1
   ctg3 101 200 ctg4 1 100
   ```

2. 新建文件 `karyotype.txt`, 内容如下：

   ```
   ctg1:1:100
   ctg3:1:200 ctg2:1:100
   ctg4:1:100
   ```

​	运行命令 `LINKVIEW2 -k karyotype.txt alignments.txt`, 您将得到如下图片:

![](https://github.com/YangJianshun/LINKVIEW2/blob/master/packages/linkview-cli/doc/images/case2.png?raw=true)



​	[在LINKVIEW-GUI中尝试](https://yangjianshun.github.io/LINKVIEW2/?inputContent=ctg1%201%20100%20ctg2%201%20100%0actg1%201%20100%20ctg3%20100%201%0actg3%20101%20200%20ctg4%201%20100%0a&karyotypeContent=ctg1:1:100%0actg3:1:200%20ctg2:1:100%0actg4:1:100&autoSubmit)



​	解释：

​	通过 `-k` 参数指定了绘图的布局文件`karyotype.txt`，LINKVIEW2 在绘图时，有一个层级的概念，`karyotype.txt`文件中的 4 行则对	应了绘图结果中的 4 个层级，第一行`ctg1:1:100`指定绘制在第一层级绘制 ctg1 的 1 到 100 bp，第二行  `ctg3:1:200 ctg2:1:100`指	定在第二层级绘制 ctg3 的 1 到 200 bp 和 ctg2 的 1 到 100 bp。第三行同理。



#### Case3

1. 在 Case2 的基础上，我们新建一个文件 `highlight.txt`，内容如下：

   ```
   ctg1 21 30
   ctg2 1 10
   ctg3 51 60 yellow
   ctg4 91 100 green
   ```

2. 运行命令 `LINKVIEW2 -k karyotype.txt alignments.txt -hl highlight.txt --style simple --bezier`，您将得到如下图片：

   ![](https://github.com/YangJianshun/LINKVIEW2/blob/master/packages/linkview-cli/doc/images/case3.png?raw=true)
   [在LINKVIEW-GUI中尝试](https://yangjianshun.github.io/LINKVIEW2/?inputContent=ctg1%201%20100%20ctg2%201%20100%0actg1%201%20100%20ctg3%20100%201%0actg3%20101%20200%20ctg4%201%20100%0a&karyotypeContent=ctg1:1:100%0actg3:1:200%20ctg2:1:100%0actg4:1:100&highlightContent=ctg1%2021%2030%0actg2%201%2010%0actg3%2051%2060%20yellow%0actg4%2091%20100%20green&style=simple&bezier=true&autoSubmit)

   
   
   解释：
   
   通过 `-hl` 参数指定了高亮文件`highlight.txt`，该文件每一行都代表一处高亮，格式为`seq start end [color]`，如果不指定颜色，则默认为红色。
   
   通过 `--style simple`指定绘图风格为 simple，目前有两种绘图风格，默认是 classic。
   
   通过 `--bezier` 指定 alignments 用贝塞尔曲线的风格绘制。

​	

#### Case4

1. 使用 blast 软件比对得到文件`blast.out`（tabular格式），如下:

   ```
   # BLASTN 2.2.28+
   # Query: genome2
   # Subject: genome1
   # Fields: query id, subject id, % identity, alignment length, mismatches, gap opens, q. start, q. end, s. start, s. end, evalue, bit score
   # 5 hits found
   genome2	genome1	99.10	5250	25	12	9256	14492	8053	13293	0.0	9415
   genome2	genome1	99.05	2639	15	6	1	2633	1	2635	0.0	4726
   genome2	genome1	99.51	1023	3	2	2621	3642	7042	8063	0.0	1860
   genome2	genome1	97.48	992	7	9	16460	17451	20448	21421	0.0	1677
   genome2	genome1	100.00	586	0	0	15890	16475	13293	13878	0.0	1083
   # BLAST processed 1 queries
   ```

2. 新建文件 `highlight.txt`，内容如下：

   ```
   genome1	2620	7041	yellow
   genome1	8037	8077	red
   genome1	13272	13312	red
   genome1	13866	20451	yellow
   genome2	2599	2639	red
   genome2	3636	9259	yellow
   genome2	14490	15888	yellow
   genome2	16442	16482	red
   ```

3. 准备两个 gff 文件 `genome1.gff` 和 `genome2.gff`

   内容分别如下：

   genome1.gff

   ```
   genome1	.	gene	5447	5994	.	-	.	ID=gene1;Name=gene1	
   genome1	.	mRNA	5447	5994	.	-	.	ID=gene1.t1;Parent=gene1;Name=gene1.t1	
   genome1	.	exon	5958	5994	.	-	.	ID=gene1.t1.exon1;Parent=gene1.t1	
   genome1	.	CDS	5958	5994	.	-	0	ID=cds.gene1.t1;Parent=gene1.t1	
   genome1	.	exon	5717	5866	.	-	.	ID=gene1.t1.exon2;Parent=gene1.t1	
   genome1	.	CDS	5717	5866	.	-	1	ID=cds.gene1.t1;Parent=gene1.t1	
   genome1	.	exon	5447	5469	.	-	.	ID=gene1.t1.exon3;Parent=gene1.t1	
   genome1	.	CDS	5447	5469	.	-	1	ID=cds.gene1.t1;Parent=gene1.t1	
   genome1	.	gene	8000	12321	.	+	.	ID=gene2;Name=gene2	
   genome1	.	mRNA	8000	12321	.	+	.	ID=gene2.t1;Parent=gene2;Name=gene2.t1	
   genome1	.	exon	8000	8184	.	+	.	ID=gene2.t1.exon1;Parent=gene2.t1	
   genome1	.	CDS	8000	8184	.	+	0	ID=cds.gene2.t1;Parent=gene2.t1	
   genome1	.	exon	10661	10718	.	+	.	ID=gene2.t1.exon2;Parent=gene2.t1	
   genome1	.	CDS	10661	10718	.	+	2	ID=cds.gene2.t1;Parent=gene2.t1	
   genome1	.	exon	11137	11198	.	+	.	ID=gene2.t1.exon3;Parent=gene2.t1	
   genome1	.	CDS	11137	11198	.	+	0	ID=cds.gene2.t1;Parent=gene2.t1	
   genome1	.	exon	11276	11375	.	+	.	ID=gene2.t1.exon4;Parent=gene2.t1	
   genome1	.	CDS	11276	11375	.	+	2	ID=cds.gene2.t1;Parent=gene2.t1	
   genome1	.	exon	11462	11503	.	+	.	ID=gene2.t1.exon5;Parent=gene2.t1	
   genome1	.	CDS	11462	11503	.	+	0	ID=cds.gene2.t1;Parent=gene2.t1	
   genome1	.	exon	11728	11778	.	+	.	ID=gene2.t1.exon6;Parent=gene2.t1	
   genome1	.	CDS	11728	11778	.	+	0	ID=cds.gene2.t1;Parent=gene2.t1	
   genome1	.	exon	12223	12321	.	+	.	ID=gene2.t1.exon7;Parent=gene2.t1	
   genome1	.	CDS	12223	12321	.	+	0	ID=cds.gene2.t1;Parent=gene2.t1	
   genome1	.	gene	13660	21052	.	+	.	ID=gene3;Name=gene3	
   genome1	.	mRNA	13660	21052	.	+	.	ID=gene3.t1;Parent=gene3;Name=gene3.t1	
   genome1	.	exon	13660	13816	.	+	.	ID=gene3.t1.exon1;Parent=gene3.t1	
   genome1	.	CDS	13660	13816	.	+	0	ID=cds.gene3.t1;Parent=gene3.t1	
   genome1	.	exon	20715	21052	.	+	.	ID=gene3.t1.exon2;Parent=gene3.t1	
   genome1	.	CDS	20715	21052	.	+	1	ID=cds.gene3.t1;Parent=gene3.t1	
   ```

   genome2.gff

   ```
   genome2	.	gene	3785	13516	.	+	.	ID=gene4;Name=gene4	
   genome2	.	mRNA	3785	13516	.	+	.	ID=gene4.t1;Parent=gene4;Name=gene4.t1	
   genome2	.	exon	3785	3925	.	+	.	ID=gene4.t1.exon1;Parent=gene4.t1	
   genome2	.	CDS	3785	3925	.	+	0	ID=cds.gene4.t1;Parent=gene4.t1	
   genome2	.	exon	5243	5375	.	+	.	ID=gene4.t1.exon2;Parent=gene4.t1	
   genome2	.	CDS	5243	5375	.	+	0	ID=cds.gene4.t1;Parent=gene4.t1	
   genome2	.	exon	9258	9387	.	+	.	ID=gene4.t1.exon3;Parent=gene4.t1	
   genome2	.	CDS	9258	9387	.	+	1	ID=cds.gene4.t1;Parent=gene4.t1	
   genome2	.	exon	11856	11913	.	+	.	ID=gene4.t1.exon4;Parent=gene4.t1	
   genome2	.	CDS	11856	11913	.	+	2	ID=cds.gene4.t1;Parent=gene4.t1	
   genome2	.	exon	12332	12393	.	+	.	ID=gene4.t1.exon5;Parent=gene4.t1	
   genome2	.	CDS	12332	12393	.	+	0	ID=cds.gene4.t1;Parent=gene4.t1	
   genome2	.	exon	12471	12570	.	+	.	ID=gene4.t1.exon6;Parent=gene4.t1	
   genome2	.	CDS	12471	12570	.	+	2	ID=cds.gene4.t1;Parent=gene4.t1	
   genome2	.	exon	12657	12698	.	+	.	ID=gene4.t1.exon7;Parent=gene4.t1	
   genome2	.	CDS	12657	12698	.	+	0	ID=cds.gene4.t1;Parent=gene4.t1	
   genome2	.	exon	12923	12964	.	+	.	ID=gene4.t1.exon8;Parent=gene4.t1	
   genome2	.	CDS	12923	12964	.	+	0	ID=cds.gene4.t1;Parent=gene4.t1	
   genome2	.	exon	13412	13516	.	+	.	ID=gene4.t1.exon9;Parent=gene4.t1	
   genome2	.	CDS	13412	13516	.	+	0	ID=cds.gene4.t1;Parent=gene4.t1	
   genome2	.	gene	16257	17081	.	+	.	ID=gene5;Name=gene5	
   genome2	.	mRNA	16257	17081	.	+	.	ID=gene5.t1;Parent=gene5;Name=gene5.t1	
   genome2	.	exon	16257	16413	.	+	.	ID=gene5.t1.exon1;Parent=gene5.t1	
   genome2	.	CDS	16257	16413	.	+	0	ID=cds.gene5.t1;Parent=gene5.t1	
   genome2	.	exon	16744	17081	.	+	.	ID=gene5.t1.exon2;Parent=gene5.t1	
   genome2	.	CDS	16744	17081	.	+	1	ID=cds.gene5.t1;Parent=gene5.t1	
   ```

4. 运行命令 `LINKVIEW2 blast.out --gff genome1.gff,genome2.gff --style simple --bezier`，您将得到如下图片：

   ![](https://github.com/YangJianshun/LINKVIEW2/blob/master/packages/linkview-cli/doc/images/case4.png?raw=true)

   [在LINKVIEW-GUI中尝试](https://yangjianshun.github.io/LINKVIEW2/?inputContent=%23%20BLASTN%202.2.28+%0a%23%20Query:%20genome2%0a%23%20Subject:%20genome1%0a%23%20Fields:%20query%20id,%20subject%20id,%20%%20identity,%20alignment%20length,%20mismatches,%20gap%20opens,%20q.%20start,%20q.%20end,%20s.%20start,%20s.%20end,%20evalue,%20bit%20score%0a%23%205%20hits%20found%0agenome2%09genome1%0999.10%095250%0925%0912%099256%0914492%098053%0913293%090.0%099415%0agenome2%09genome1%0999.05%092639%0915%096%091%092633%091%092635%090.0%094726%0agenome2%09genome1%0999.51%091023%093%092%092621%093642%097042%098063%090.0%091860%0agenome2%09genome1%0997.48%09992%097%099%0916460%0917451%0920448%0921421%090.0%091677%0agenome2%09genome1%09100.00%09586%090%090%0915890%0916475%0913293%0913878%090.0%091083%0a%23%20BLAST%20processed%201%20queries&highlightContent=genome1%092620%097041%09yellow%0agenome1%098037%098077%09red%0agenome1%0913272%0913312%09red%0agenome1%0913866%0920451%09yellow%0agenome2%092599%092639%09red%0agenome2%093636%099259%09yellow%0agenome2%0914490%0915888%09yellow%0agenome2%0916442%0916482%09red&gffContent=genome1%09.%09gene%095447%095994%09.%09-%09.%09ID=gene1;Name=gene1%09%0agenome1%09.%09mRNA%095447%095994%09.%09-%09.%09ID=gene1.t1;Parent=gene1;Name=gene1.t1%09%0agenome1%09.%09exon%095958%095994%09.%09-%09.%09ID=gene1.t1.exon1;Parent=gene1.t1%09%0agenome1%09.%09CDS%095958%095994%09.%09-%090%09ID=cds.gene1.t1;Parent=gene1.t1%09%0agenome1%09.%09exon%095717%095866%09.%09-%09.%09ID=gene1.t1.exon2;Parent=gene1.t1%09%0agenome1%09.%09CDS%095717%095866%09.%09-%091%09ID=cds.gene1.t1;Parent=gene1.t1%09%0agenome1%09.%09exon%095447%095469%09.%09-%09.%09ID=gene1.t1.exon3;Parent=gene1.t1%09%0agenome1%09.%09CDS%095447%095469%09.%09-%091%09ID=cds.gene1.t1;Parent=gene1.t1%09%0agenome1%09.%09gene%098000%0912321%09.%09+%09.%09ID=gene2;Name=gene2%09%0agenome1%09.%09mRNA%098000%0912321%09.%09+%09.%09ID=gene2.t1;Parent=gene2;Name=gene2.t1%09%0agenome1%09.%09exon%098000%098184%09.%09+%09.%09ID=gene2.t1.exon1;Parent=gene2.t1%09%0agenome1%09.%09CDS%098000%098184%09.%09+%090%09ID=cds.gene2.t1;Parent=gene2.t1%09%0agenome1%09.%09exon%0910661%0910718%09.%09+%09.%09ID=gene2.t1.exon2;Parent=gene2.t1%09%0agenome1%09.%09CDS%0910661%0910718%09.%09+%092%09ID=cds.gene2.t1;Parent=gene2.t1%09%0agenome1%09.%09exon%0911137%0911198%09.%09+%09.%09ID=gene2.t1.exon3;Parent=gene2.t1%09%0agenome1%09.%09CDS%0911137%0911198%09.%09+%090%09ID=cds.gene2.t1;Parent=gene2.t1%09%0agenome1%09.%09exon%0911276%0911375%09.%09+%09.%09ID=gene2.t1.exon4;Parent=gene2.t1%09%0agenome1%09.%09CDS%0911276%0911375%09.%09+%092%09ID=cds.gene2.t1;Parent=gene2.t1%09%0agenome1%09.%09exon%0911462%0911503%09.%09+%09.%09ID=gene2.t1.exon5;Parent=gene2.t1%09%0agenome1%09.%09CDS%0911462%0911503%09.%09+%090%09ID=cds.gene2.t1;Parent=gene2.t1%09%0agenome1%09.%09exon%0911728%0911778%09.%09+%09.%09ID=gene2.t1.exon6;Parent=gene2.t1%09%0agenome1%09.%09CDS%0911728%0911778%09.%09+%090%09ID=cds.gene2.t1;Parent=gene2.t1%09%0agenome1%09.%09exon%0912223%0912321%09.%09+%09.%09ID=gene2.t1.exon7;Parent=gene2.t1%09%0agenome1%09.%09CDS%0912223%0912321%09.%09+%090%09ID=cds.gene2.t1;Parent=gene2.t1%09%0agenome1%09.%09gene%0913660%0921052%09.%09+%09.%09ID=gene3;Name=gene3%09%0agenome1%09.%09mRNA%0913660%0921052%09.%09+%09.%09ID=gene3.t1;Parent=gene3;Name=gene3.t1%09%0agenome1%09.%09exon%0913660%0913816%09.%09+%09.%09ID=gene3.t1.exon1;Parent=gene3.t1%09%0agenome1%09.%09CDS%0913660%0913816%09.%09+%090%09ID=cds.gene3.t1;Parent=gene3.t1%09%0agenome1%09.%09exon%0920715%0921052%09.%09+%09.%09ID=gene3.t1.exon2;Parent=gene3.t1%09%0agenome1%09.%09CDS%0920715%0921052%09.%09+%091%09ID=cds.gene3.t1;Parent=gene3.t1%0agenome2%09.%09gene%093785%0913516%09.%09+%09.%09ID=gene4;Name=gene4%09%0agenome2%09.%09mRNA%093785%0913516%09.%09+%09.%09ID=gene4.t1;Parent=gene4;Name=gene4.t1%09%0agenome2%09.%09exon%093785%093925%09.%09+%09.%09ID=gene4.t1.exon1;Parent=gene4.t1%09%0agenome2%09.%09CDS%093785%093925%09.%09+%090%09ID=cds.gene4.t1;Parent=gene4.t1%09%0agenome2%09.%09exon%095243%095375%09.%09+%09.%09ID=gene4.t1.exon2;Parent=gene4.t1%09%0agenome2%09.%09CDS%095243%095375%09.%09+%090%09ID=cds.gene4.t1;Parent=gene4.t1%09%0agenome2%09.%09exon%099258%099387%09.%09+%09.%09ID=gene4.t1.exon3;Parent=gene4.t1%09%0agenome2%09.%09CDS%099258%099387%09.%09+%091%09ID=cds.gene4.t1;Parent=gene4.t1%09%0agenome2%09.%09exon%0911856%0911913%09.%09+%09.%09ID=gene4.t1.exon4;Parent=gene4.t1%09%0agenome2%09.%09CDS%0911856%0911913%09.%09+%092%09ID=cds.gene4.t1;Parent=gene4.t1%09%0agenome2%09.%09exon%0912332%0912393%09.%09+%09.%09ID=gene4.t1.exon5;Parent=gene4.t1%09%0agenome2%09.%09CDS%0912332%0912393%09.%09+%090%09ID=cds.gene4.t1;Parent=gene4.t1%09%0agenome2%09.%09exon%0912471%0912570%09.%09+%09.%09ID=gene4.t1.exon6;Parent=gene4.t1%09%0agenome2%09.%09CDS%0912471%0912570%09.%09+%092%09ID=cds.gene4.t1;Parent=gene4.t1%09%0agenome2%09.%09exon%0912657%0912698%09.%09+%09.%09ID=gene4.t1.exon7;Parent=gene4.t1%09%0agenome2%09.%09CDS%0912657%0912698%09.%09+%090%09ID=cds.gene4.t1;Parent=gene4.t1%09%0agenome2%09.%09exon%0912923%0912964%09.%09+%09.%09ID=gene4.t1.exon8;Parent=gene4.t1%09%0agenome2%09.%09CDS%0912923%0912964%09.%09+%090%09ID=cds.gene4.t1;Parent=gene4.t1%09%0agenome2%09.%09exon%0913412%0913516%09.%09+%09.%09ID=gene4.t1.exon9;Parent=gene4.t1%09%0agenome2%09.%09CDS%0913412%0913516%09.%09+%090%09ID=cds.gene4.t1;Parent=gene4.t1%09%0agenome2%09.%09gene%0916257%0917081%09.%09+%09.%09ID=gene5;Name=gene5%09%0agenome2%09.%09mRNA%0916257%0917081%09.%09+%09.%09ID=gene5.t1;Parent=gene5;Name=gene5.t1%09%0agenome2%09.%09exon%0916257%0916413%09.%09+%09.%09ID=gene5.t1.exon1;Parent=gene5.t1%09%0agenome2%09.%09CDS%0916257%0916413%09.%09+%090%09ID=cds.gene5.t1;Parent=gene5.t1%09%0agenome2%09.%09exon%0916744%0917081%09.%09+%09.%09ID=gene5.t1.exon2;Parent=gene5.t1%09%0agenome2%09.%09CDS%0916744%0917081%09.%09+%091%09ID=cds.gene5.t1;Parent=gene5.t1%09&style=simple&bezier=true&autoSubmit)
   

   解释：

   可通过 参数 `-g` 或 `--gff` 指定1个或多个 gff 文件，多个 gff 文件以英文逗号分隔。指定 gff 文件后，LINKVIEW 会绘制出基因结构。

   

#### Case5

1. 新建一个文件 `alignments.txt`，内容如下：

   ```
   ctg1 1 10000000 ctg2 1 10000000
   ```

2. 新建一个文件 `karyotype.txt`，内容如下：

   ```
   ctg1:1:5000000
   ctg2:3000001:10000000
   ```

3. 运行命令 `LINKVIEW2 -k karyotype.txt --style simple --chro_axis alignments.txt`，您将得到图片如下：
   )
   ![](https://github.com/YangJianshun/LINKVIEW2/blob/master/packages/linkview-cli/doc/images/case5.png?raw=true)
   [在LINKVIEW-GUI中尝试](https://yangjianshun.github.io/LINKVIEW2/?inputContent=ctg1%201%2010000000%20ctg2%201%2010000000&karyotypeContent=ctg1:1:5000000%0actg2:3000001:10000000&style=simple&chro_axis=true&autoSubmit)

   解释：

   - ctg1 的 1bp 到 10Mb 比对到了 ctg2 的 1bp 到 10 Mb， `karyotype.txt`文件中指定了仅绘制 ctg1 的 1bp 到 5Mb 和 ctg2 的 3 Mb 到 10Mb，此时 LINKVIEW2 经过计算得知，应该展示的比对是 ctg1 的 3Mb 到 5Mb 对应于 ctg2 点 3Mb 到 5Mb。
   - 参数 --chro_axis 说明需要绘制坐标轴。

   

#### Case6

1. 新建一个文件 `alignments.txt`，内容如下：

   ```
   ctg1 1 2000000 ctg2 3000001 5000000
   ctg4 1 2000000 ctg2 5000001 7000000
   ```

2. 新建一个文件 `karyotype.txt`，内容如下：

   ```
   ctg1:1:2000000
   ctg2 ctg3
   ctg4:1:2000000
   ```

3. 运行命令 `LINKVIEW2 -k karyotype.txt alignments.txt --chro_axis`，会有如下提示信息输出：

   ```
   warn: ctg2 lacks start and end information. It automatically calculates that start is 3000001 and end is 7000000.
   warn: 'ctg3' is missing start and end information and will be ignored！
   ```

   您会得到图片如下：
   ![](https://github.com/YangJianshun/LINKVIEW2/blob/master/packages/linkview-cli/doc/images/case6.png?raw=true)
   [在LINKVIEW-GUI中尝试](https://yangjianshun.github.io/LINKVIEW2/?inputContent=ctg1%201%202000000%20ctg2%203000001%205000000%0actg4%201%202000000%20ctg2%205000001%207000000&karyotypeContent=ctg1:1:2000000%0actg2%20ctg3%0actg4:1:2000000&chro_axis=true&autoSubmit)
   
   解释：
   
   在 `karyotype.txt`文件中，没有指定 ctg2 和 ctg3 的绘制的起始和终止位置，LINKVIEW2 通过 alignments 推断出 ctg2 应该展示的是 3Mb 到 7Mb，而 ctg3 无法推断出应该展示哪部分区间，所以被省略了。如果确实需要展示 ctg3，请在 `karyotype.txt`文件中指定起始和终止位置。
   
   
   
#### Case7

1. 新建一个文件 `alignments.txt`，内容如下：

   ```
   ctg1 1 10000000 ctg2 1 10000000
   ctg1 1 10000000 ctg3 1 10000000
   ctg3 1 10000000 ctg4 1 10000000
   ctg4 1 10000000 ctg5 1 10000000
   ```

2. 新建一个文件 `karyotype.txt`，内容如下：

   ```
   ctg1:1:10000000
   ctg3:1:10000000 ctg2:10000000:1
   ctg4:1:10000000
   ctg5:1:10000000
   ```

3. 运行命令 `LINKVIEW2 alignments.txt -k karyotype.txt --style=simple --align left --chro_axis --chro_axis_unit 200kb`，您将得到图片如下：

   ![](https://github.com/YangJianshun/LINKVIEW2/blob/master/packages/linkview-cli/doc/images/case7.png?raw=true)
   [在LINKVIEW-GUI中尝试](https://yangjianshun.github.io/LINKVIEW2/?inputContent=ctg1%201%2010000000%20ctg2%201%2010000000%0actg1%201%2010000000%20ctg3%201%2010000000%0actg3%201%2010000000%20ctg4%201%2010000000%0actg4%201%2010000000%20ctg5%201%2010000000&karyotypeContent=ctg1:1:10000000%0actg3:1:10000000%20ctg2:10000000:1%0actg4:1:10000000%0actg5:1:10000000&chro_axis=true&chro_axis_unit=200kb&style=simple&autoSubmit)
   
   解释：
   
   - 在 `karyotype.txt` 文件中  `ctg2:10000000:1` 指定在第 2 层级展示 ctg2，并且展示的起始位置是 10Mb，终止位置是 1bp，这样会将 ctg2 反向地绘制出来。
   
   - 通过参数 `--align`指定为 left，图中的绘制的序列都是左对齐地排列（默认是居中对齐），还可以设置为 right，即为右对齐
   
   - 参数 ` --chro_axis_unit` 表示绘制的坐标轴的最小刻度单元，此处设置为了 200kb，这个参数可以指定为数字，也可以是能被解析为“碱基数”的字符串，比如`200kb`、`1Mb`、`500bp`等。
   
     
   

#### Case8

在上述 Case7 的基础上，如果您想要实现如下效果：

- 把 ctg1 的标签向上调整一下位置，字体大小设置为25px，标签的角度设为0
- ctg1的刻度想要绘制在上面
- ctg4的标签在左边展示
- ctg1 和 ctg5 想要居中对齐
- ctg5的坐标轴最小刻度单元设置为0.5Mb

1. 那么您需要新建一个文件 `parameter.txt`，内容如下：

```
label_y_offset=-10 label_font_size=25 chro_axis_pos=top align=center

label_pos=left
align=center chro_axis_unit=0.5Mb
```

2. 运行命令 `LINKVIEW2 alignments.txt -k karyotype.txt --style=simple --align left --chro_axis --chro_axis_unit 200kb -p parameter.txt `，您将得到图片如下：
    ![](https://github.com/YangJianshun/LINKVIEW2/blob/master/packages/linkview-cli/doc/images/case8.png?raw=true)
    [在LINKVIEW-GUI中尝试](https://yangjianshun.github.io/LINKVIEW2/?inputContent=ctg1%201%2010000000%20ctg2%201%2010000000%0actg1%201%2010000000%20ctg3%201%2010000000%0actg3%201%2010000000%20ctg4%201%2010000000%0actg4%201%2010000000%20ctg5%201%2010000000&karyotypeContent=ctg1:1:10000000%0actg3:1:10000000%20ctg2:10000000:1%0actg4:1:10000000%0actg5:1:10000000&chro_axis=true&chro_axis_unit=200kb&style=simple&parameterContent=label_y_offset=-10%20label_font_size=25%20chro_axis_pos=top%20align=center%0a%0alabel_pos=left%0aalign=center%20chro_axis_unit=0.5Mb&autoSubmit)
  
   解释：
   
   - LINKVIEW2 提供了一组 Drawing options，这一组参数既可以在命令行中全局指定，也可以在通过 `-p` 指定一个 parameter 文件，在这个文件中对绘图的每一个层级分别指定不同的作图参数
   - 在 `parameter.txt`文件中，因为我们不需要对绘图的第三层级做出额外修改，所以第三行为空



#### 其他

上述 8 个 case，涵盖了 LINKVIEW2 这个简单做图工具的大部分功能，当然还有一些小功能，限于篇幅，不再举例说明。

- LINKVIEW2 会自动判断 alignments 的类型
- 相同的序列可以在绘图中出现多次，只需要在 karyotype 文件中多次写到即可
- 可以通过 `--scale` 设定比例尺，通过`--show_scale` 控制是否展示比例尺等
- Drawing options 中的 --gap_length 可用于调整绘制序列之间的间隔
- 提供了一组 Filter options，可用于对 alignments 进行过滤
- 提供了一组 Svg options，可调节 svg 图片对宽高等
- ......

  

  



