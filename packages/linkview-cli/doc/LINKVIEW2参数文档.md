本文将详细介绍 LINKVIEW2 的参数

### alignments 文件

LINKVIEW2 能自动判断 alignments 格式，目前支持的 alignments 格式如下：

1. LINKVIEW 专属格式，例如

   ```
   ctg1 1 100 ctg2 1 100
   ctg1 101 200 ctg3 1 100 red:0.5
   ```

2. blast 比对结果（tabular格式），例如

   ```
   ctg2	ctg1	99.10	5250	25	12	9256	14492	8053	13293	2e-5	1.395e+05
   ctg2	ctg1	99.05	2639	15	6	1	2633	1	2635	0.0	4726
   ```

3. MUMmer 的比对结果 （show-coords 命令生成的文件），例如

   ```
   ctg2	Sep 04 2021	14510784	NUCMER	/path/to/ctg1.fa	ctg1	7636865	7638890	312202	314269	90.199814	90.199814	2026	0	0	NULL	0	Plus	18585056	0	0
   ctg2	Sep 04 2021	14510784	NUCMER	/path/to/ctg1.fa	ctg1	7337323	7337583	571926	572193	91.449814	91.449814	261	0	0	NULL	0	Plus	18585056	0	0
   ```

   或者

   ```
   /path/to/ctg1.fa /path/to/ctg2.fa
   NUCMER
   
       [S1]     [E1]  |     [S2]     [E2]  |  [LEN 1]  [LEN 2]  |  [LEN R]  [LEN Q]  |  [COV R]  [COV Q]  | [TAGS]
   ===================================================================================================================
     312202   314269  |  7636865  7638890  |     2068     2026  | 18585056 14510784  |     0.01     0.01  | ctg1	ctg2
     571926   572193  |  7337323  7337583  |      268      261  | 18585056 14510784  |     0.00     0.00  | ctg1	ctg2
   ```

   或者

   ```
   /path/to/ctg1.fa /path/to/ctg2.fa
   NUCMER
   
       [S1]     [E1]  |     [S2]     [E2]  |  [LEN 1]  [LEN 2]  |  [% IDY]  | [TAGS]
   =====================================================================================
     312202   314269  |  7636865  7638890  |     2068     2026  |    90.20  | ctg1	ctg2
     571926   572193  |  7337323  7337583  |      268      261  |    91.45  | ctg1	ctg2
   ```

   或者

   ```
   /path/to/ctg1.fa /path/to/ctg2.fa
   NUCMER
   
   [S1]	[E1]	[S2]	[E2]	[LEN 1]	[LEN 2]	[% IDY]	[LEN R]	[LEN Q]	[COV R]	[COV Q]	[TAGS]
   312202	314269	7636865	7638890	2068	2026	90.20	18585056	14510784	0.01	0.01	ctg1	ctg2
   571926	572193	7337323	7337583	268	261	91.45	18585056	14510784	0.00	0.00	ctg1	ctg2
   ```

   ……

   

4. Minimap2 比对结果（paf格式），例如：

   ```
   ctg1	78060761	56679579	56924210	-	ctg2	64984695	42479076	42722952	218588	245765	60	tp:A:P	cm:i:21472	s1:i:217985	s2:i:3364	dv:f:0.0058
   ctg1	78060761	46226144	46407750	+	ctg2	64984695	41282053	41461131	161187	183847	60	tp:A:P	cm:i:15731	s1:i:159743	s2:i:3827	dv:f:0.0045
   ```
   
   

### 基本参数

- -V, --version 

  输出版本号

- -h, --help 

  输出帮助信息

### Normal options

- -k, --karyotype

  指定一个绘图的布局文件，该文件的每一行代表绘图的每一层级，每一行用空白符分割，每个 item 代表绘图的每个序列，每个 item 的格式为 `seq:start:end`，如果在 item 左边或右边加上`-`，则会在绘制的序列左侧或右侧标记一个短横线。

- -hl, --highlight

  指定一个或多个 highlight 文件，多个文件用逗号分隔。highlight 文件的每一行代表一处高亮，格式为 `seq start end [color]`，注意 `[color:opacity]`表示颜色和透明度可以省略，并不是说您在 highlight 文件中要写上小括号。颜色默认值为 `red`，支持16进制颜色和 rgb 颜色格式。

- --hl_min1px

  加上这个参数，每个highlight，即使宽度小于一个像素，也会强行展示出一个像素。比如 ctg1 展示的范围是 1Mb 到 30Mb，而某highlight 的范围只有 10bp，这样计算出来的像素宽度非常小，作图后不容易看到，使用 `--hl_min1px`参数能将这种小的 highlight 强行展示为 1px。

- -g --gff

  指定一个或多个 gff 文件，用于绘制基因结构。

- --scale

  指定比例尺，一个像素代表多少bp。默认值时 auto，表示 LINKVIEW2 会自动计算比例尺。

- --show_scale

  指定该参数后，在绘图的右下角会以一个线段展示出比例尺。

### Filter options

这一组参数用于对 alignments 进行过滤。

- --min_alignment_length

  默认值为0，长度小于此值的 alignments，会被过滤掉。对所有格式的 alignments 都有效。

- --min_identity

  默认值时70，identity 低于此值的 alignments 将被过滤，对 blast 和 MUMmer 软件的比对结果有效。

- --min_bit_score

  默认值是1000，bit_score 低于此值的 alignments 将被过滤，对 blast 软件的比对结果有效。

- --max_evalue

  默认值是1e-5，evalue 高于此值的 alignments 将被过滤，对 blast 软件的比对结果有效。

### Drawing options

这是一组作图参数，既可以通过命令行参数全局指定，也可以通过 `-p, --parameter`参数指定一个参数文件，对作图的每一层级分别指定。

- --chro_thickness

  绘制的序列的高度，默认15

- -n, --no_label

  不展示标签

- --label_font_size

  标签字体大小，默认为 18

- --label_angle

  标签旋转角度，默认为 30

- --label_pos

  标签的位置，可选 left | center |  right，默认是 right

- --label_x_offset

  标签的 x 方向偏移，默认为0

- --label_y_offset

  标签的 y 方向偏移，默认为0

- --chro_axis

  展示 坐标轴刻度
  
- --chro_axis_unit
  
  坐标轴刻度的最小单元。默认为 auto，表示由 LINKVIEW2 自行推断
  
- --chro_axis_pos
  
  坐标轴的位置，可选 top | bottom | both，默认为 bottom
  
- --gap_length
  
  两个序列之间的间隔。如果小于1，那么间隔为 这一层级所有序列的总长 * gap_length。如果大于1，表示间隔为 gap_length bp。
  
- --align
  
  绘图的序列的对齐方式，可选 center | left | right，默认为 center
  
- -p --parameter
  
  通过此参数指定一个参数文件，对绘图的每一层级分别指定作图参数，仅 Drawing options 中的参数可由此文件指定。
  
  格式举例如下：
  
  ```
  label_font_size=25 chro_axis=true
  chro_thickness=20 no_label=false
  ```
  
### Style options

- --bezier

- 将 alignments 绘制成贝塞尔曲线风格

- --style

  作图的风格，可选 classic | simple，默认为 classic

### Svg options

- --svg_height

  作图的高度，默认为800

- --svg_width 

  作图的宽度，默认为1200

- --svg_space 

  作图左右两侧留空比例，默认为 0.2

###  Output options:

- -o --output

  输出文件的前缀，默认为 linkview2_output。LINKVIEW2 会输出 svg 和 png 格式的两个文件。

