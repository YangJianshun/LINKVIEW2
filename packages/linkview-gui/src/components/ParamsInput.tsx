import { Form, Input, Button, Space, Select, Collapse, Switch, InputNumber, Col } from 'antd';
import { PlusOutlined, CloseCircleOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import './ParamsInput.css';
import initOptions from '../initOptions';
import { Options } from '@linkview/linkview-core';
import { useState, useEffect, useRef } from 'react';
import queryString from 'query-string';

const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;

type PropsType = {
  onSubmit: (options: Options) => void;
}

const ParamsInput = ({ onSubmit }: PropsType) => {

  const urlOptions = queryString.parse(
    window.location.href.slice(window.location.href.indexOf('?') + 1),
    { parseBooleans: true, parseNumbers: true }
  );

  const [form] = Form.useForm();
  const [showKaryotype, setShowKaryotype] = useState<boolean>(false);
  const [showHighlight, setShowHighlight] = useState<boolean>(false);
  const [showParameter, setShowParameter] = useState<boolean>(false);
  const [showGff, setShowGff] = useState<boolean>(false);
  console.log('showKaryotype', showKaryotype)

  const addKaryotypeRef = useRef(null);
  const addHighlightRef = useRef(null);
  const addParameterRef = useRef(null);
  const addGffRef = useRef(null);
  Object.assign(initOptions, urlOptions)
  console.log('urlOptions', urlOptions)
  useEffect(() => {
    // @ts-ignore
    if (urlOptions.karyotypeContent) addKaryotypeRef.current.click();
    // @ts-ignore
    if (urlOptions.highlightContent) addHighlightRef.current.click();
    // @ts-ignore
    if (urlOptions.parameterContent) addParameterRef.current.click();
    // @ts-ignore
    if (urlOptions.gffContent) addGffRef.current.click();
    if ('autoSubmit' in urlOptions) form.submit();
  }, []);

  const onFinish = (values: any) => {
    const svg_width = values.svg_width ? values.svg_width : initOptions.svg_width;
    const svg_space = values.svg_space ? values.svg_space : initOptions.svg_space;
    onSubmit({
      ...values,
      karyotypeContent: values.karyotypeContent
        ? values.karyotypeContent.karyotypeContent
        : '',
      highlightContent: values.highlightContent
        ? values.highlightContent.highlightContent
        : '',
      gffContent: values.gffContent
        ? values.gffContent.gffContent
        : '',
      parameterContent: values.parameterContent
        ? values.parameterContent.parameterContent
        : '',
      svg_content_width: svg_width * (1 - svg_space)
    } as Options);
  };

  return (
    <Form
      form={form}
      name='dynamic_form_nest_item'
      onFinish={onFinish}
      autoComplete='off'
      size='large'
    >
      {/* alignments */}
      <label>alignments</label>
      <Form.Item
        name='inputContent'
        label=''
        initialValue={initOptions.inputContent}
      >
        <TextArea rows={10} wrap='off' className='file-input' allowClear onBlur={() => form.submit()}/>
      </Form.Item>
      {/* 折叠面板 */}
      <Collapse ghost style={{ marginBottom: 20 }}>
        <Panel header='Normal options:' key='1'>
          <Form.Item
            name='hl_min1px'
            label='hl_min1px'
            valuePropName='checked'
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 6, offset: 6 }}
            initialValue={initOptions.hl_min1px}
          >
            <Switch
              defaultChecked={false}
              onChange={() => {
                form.submit();
              }}
            />
          </Form.Item>
          <Form.Item
            name='show_scale'
            label='show_scale'
            valuePropName='checked'
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 6, offset: 6 }}
            initialValue={initOptions.show_scale}
          >
            <Switch
              defaultChecked={false}
              onChange={() => {
                form.submit();
              }}
            />
          </Form.Item>
          <Form.Item
            name='scale'
            label='scale'
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 6, offset: 6 }}
            initialValue={initOptions.scale || ''}
          >
            <InputNumber
              min={0}
              controls={false}
              addonAfter='bp/px'
              onBlur={() => {
                form.submit();
              }}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Panel>
        <Panel header='Filter options' key='2'>
          <Form.Item
            name='min_alignment_length'
            label='min_alignment_length'
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 6, offset: 6 }}
            initialValue={initOptions.min_alignment_length}
          >
            <InputNumber
              min={0}
              controls={false}
              addonAfter='bp'
              onBlur={() => {
                form.submit();
              }}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            name='min_identity'
            label='min_identity'
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 6, offset: 6 }}
            initialValue={initOptions.min_identity}
          >
            <InputNumber
              min={0}
              controls={false}
              addonAfter='%'
              onBlur={() => {
                form.submit();
              }}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            name='min_bit_score'
            label='min_bit_score'
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 6, offset: 6 }}
            initialValue={initOptions.min_bit_score}
          >
            <InputNumber
              min={0}
              controls={false}
              addonAfter=''
              onBlur={() => {
                form.submit();
              }}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            name='max_evalue'
            label='max_evalue'
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 6, offset: 6 }}
            initialValue={initOptions.max_evalue}
          >
            <InputNumber
              min={0}
              max={1}
              controls={false}
              addonAfter=''
              onBlur={() => {
                form.submit();
              }}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Panel>
        <Panel header='Drawing options' key='3'>
          <Form.Item
            name='chro_thickness'
            label='chro_thickness'
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 6, offset: 6 }}
            initialValue={initOptions.chro_thickness}
          >
            <InputNumber
              min={0}
              controls={false}
              addonAfter='px'
              onBlur={() => {
                form.submit();
              }}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            name='no_label'
            label='no_label'
            valuePropName='checked'
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 6, offset: 6 }}
            initialValue={initOptions.no_label}
          >
            <Switch
              defaultChecked={false}
              onChange={() => {
                form.submit();
              }}
            />
          </Form.Item>
          <Form.Item
            name='label_font_size'
            label='label_font_size'
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 6, offset: 6 }}
            initialValue={initOptions.label_font_size}
          >
            <InputNumber
              min={0}
              controls={false}
              addonAfter='px'
              onBlur={() => {
                form.submit();
              }}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            name='label_angle'
            label='label_angle'
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 6, offset: 6 }}
            initialValue={initOptions.label_angle}
          >
            <InputNumber
              min={0}
              controls={false}
              addonAfter='px'
              onBlur={() => {
                form.submit();
              }}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            name='label_pos'
            label='label_pos'
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 6, offset: 6 }}
            initialValue={initOptions.label_pos}
          >
            <Select
              onChange={() => {
                form.submit();
              }}
            >
              <Option value='left'>left</Option>
              <Option value='center'>center</Option>
              <Option value='right'>right</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name='label_x_offset'
            label='label_x_offset'
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 6, offset: 6 }}
            initialValue={initOptions.label_x_offset}
          >
            <InputNumber
              min={0}
              controls={false}
              addonAfter='px'
              onBlur={() => {
                form.submit();
              }}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            name='label_y_offset'
            label='label_y_offset'
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 6, offset: 6 }}
            initialValue={initOptions.label_y_offset}
          >
            <InputNumber
              min={0}
              controls={false}
              addonAfter='px'
              onBlur={() => {
                form.submit();
              }}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            name='chro_axis'
            label='chro_axis'
            valuePropName='checked'
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 6, offset: 6 }}
            initialValue={initOptions.chro_axis}
          >
            <Switch
              defaultChecked={false}
              onChange={() => {
                form.submit();
              }}
            />
          </Form.Item>
          <Form.Item
            name='chro_axis_unit'
            label='chro_axis_unit'
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 6, offset: 6 }}
            initialValue={initOptions.chro_axis_unit}
          >
            <Input
              onBlur={(ele) => {
                form.submit();
              }}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            name='chro_axis_pos'
            label='chro_axis_pos'
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 6, offset: 6 }}
            initialValue={initOptions.chro_axis_pos}
          >
            <Select
              onChange={() => {
                form.submit();
              }}
            >
              <Option value='top'>top</Option>
              <Option value='bottom'>bottom</Option>
              <Option value='both'>both</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name='gap_length'
            label='gap_length'
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 6, offset: 6 }}
            initialValue={initOptions.gap_length}
          >
            <InputNumber
              min={0}
              controls={false}
              addonAfter=''
              onBlur={() => {
                form.submit();
              }}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            name='align'
            label='align'
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 6, offset: 6 }}
            initialValue={initOptions.align}
          >
            <Select
              onChange={() => {
                form.submit();
              }}
            >
              <Option value='left'>left</Option>
              <Option value='center'>center</Option>
              <Option value='right'>right</Option>
            </Select>
          </Form.Item>
        </Panel>
        <Panel header='Style options' key='4'>
          <Form.Item
            name='bezier'
            label='bezier'
            valuePropName='checked'
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 6, offset: 6 }}
            initialValue={initOptions.bezier}
          >
            <Switch
              defaultChecked={false}
              onChange={() => {
                form.submit();
              }}
            />
          </Form.Item>
          <Form.Item
            name='style'
            label='style'
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 6, offset: 6 }}
            initialValue={initOptions.style}
          >
            <Select
              onChange={() => {
                form.submit();
              }}
            >
              <Option value='classic'>classic</Option>
              <Option value='simple'>simple</Option>
            </Select>
          </Form.Item>
        </Panel>
        <Panel header='Svg options' key='5'>
          <Form.Item
            name='svg_height'
            label='svg_height'
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 6, offset: 6 }}
            initialValue={initOptions.svg_height}
          >
            <InputNumber
              min={0}
              controls={false}
              addonAfter=''
              onBlur={() => {
                form.submit();
              }}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            name='svg_width'
            label='svg_width'
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 6, offset: 6 }}
            initialValue={initOptions.svg_width}
          >
            <InputNumber
              min={0}
              controls={false}
              addonAfter=''
              onBlur={() => {
                form.submit();
              }}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            name='svg_space'
            label='svg_space'
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 6, offset: 6 }}
            initialValue={initOptions.svg_space}
          >
            <InputNumber
              min={0}
              controls={false}
              addonAfter=''
              onBlur={() => {
                form.submit();
              }}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Panel>
      </Collapse>
      {/* 添加 karyotypeContent */}
      <Form.List name='karyotypeContent'>
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              // <Space key={field.key} align='baseline'>
              <div key='karyotypeContent'>
                <CloseCircleOutlined
                  onClick={() => {
                    setShowKaryotype(false);
                    remove(field.name);
                    form.submit();
                  }}
                  className='clear-btn'
                />
                <label style={{ marginLeft: 10 }}>karyotype</label>
                <Form.Item
                  name='karyotypeContent'
                  label=''
                  initialValue={initOptions.karyotypeContent}
                >
                  <TextArea
                    rows={10}
                    wrap='off'
                    className='file-input'
                    size='large'
                    allowClear
                    onBlur={() => form.submit()}
                  />
                </Form.Item>
              </div>
            ))}

            {showKaryotype ? null : (
              <Form.Item>
                <Button
                  ref={addKaryotypeRef}
                  type='dashed'
                  onClick={() => {
                    setShowKaryotype(true);
                    add();
                  }}
                  block
                  icon={<PlusOutlined />}
                >
                  Add karyotype
                </Button>
              </Form.Item>
            )}
          </>
        )}
      </Form.List>
      {/* 添加 highlightContent */}
      <Form.List name='highlightContent'>
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              // <Space key={field.key} align='baseline'>
              <div key='highlightContent'>
                <CloseCircleOutlined
                  onClick={() => {
                    setShowHighlight(false);
                    remove(field.name);
                    form.submit();
                  }}
                  className='clear-btn'
                />
                <label style={{ marginLeft: 10 }}>Highlights</label>
                <Form.Item
                  name='highlightContent'
                  label=''
                  initialValue={initOptions.highlightContent}
                >
                  <TextArea
                    rows={10}
                    wrap='off'
                    className='file-input'
                    size='large'
                    allowClear
                    onBlur={() => form.submit()}
                  />
                </Form.Item>
              </div>
            ))}

            {showHighlight ? null : (
              <Form.Item>
                <Button
                  ref={addHighlightRef}
                  type='dashed'
                  onClick={() => {
                    setShowHighlight(true);
                    add();
                  }}
                  block
                  icon={<PlusOutlined />}
                >
                  Add highlights
                </Button>
              </Form.Item>
            )}
          </>
        )}
      </Form.List>
      {/* 添加 parameterContent */}
      <Form.List name='parameterContent'>
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              // <Space key={field.key} align='baseline'>
              <div key='parameterContent'>
                <CloseCircleOutlined
                  onClick={() => {
                    setShowParameter(false);
                    remove(field.name);
                    form.submit();
                  }}
                  className='clear-btn'
                />
                <label style={{ marginLeft: 10 }}>parameter</label>
                <Form.Item
                  name='parameterContent'
                  label=''
                  initialValue={initOptions.parameterContent}
                >
                  <TextArea
                    rows={10}
                    wrap='off'
                    className='file-input'
                    size='large'
                    allowClear
                    onBlur={() => form.submit()}
                  />
                </Form.Item>
              </div>
            ))}

            {showParameter ? null : (
              <Form.Item>
                <Button
                  ref={addParameterRef}
                  type='dashed'
                  onClick={() => {
                    setShowParameter(true);
                    add();
                  }}
                  block
                  icon={<PlusOutlined />}
                >
                  Add parameters
                </Button>
              </Form.Item>
            )}
          </>
        )}
      </Form.List>
      {/* 添加 highlightContent */}
      <Form.List name='gffContent'>
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <div key='gffContent'>
                <CloseCircleOutlined
                  onClick={() => {
                    setShowGff(false);
                    remove(field.name);
                    form.submit();
                  }}
                  className='clear-btn'
                />
                <label style={{ marginLeft: 10 }}>gff</label>
                <Form.Item
                  name='gffContent'
                  label=''
                  initialValue={initOptions.gffContent}
                >
                  <TextArea
                    rows={10}
                    wrap='off'
                    className='file-input'
                    size='large'
                    allowClear
                    onBlur={() => form.submit()}
                  />
                </Form.Item>
              </div>
            ))}

            {showGff ? null : (
              <Form.Item>
                <Button
                  ref={addGffRef}
                  type='dashed'
                  onClick={() => {
                    setShowGff(true);
                    add();
                  }}
                  block
                  icon={<PlusOutlined />}
                >
                  Add gff
                </Button>
              </Form.Item>
            )}
          </>
        )}
      </Form.List>

      {/* 提交按钮 */}
      <Form.Item>
        <Button type='primary' htmlType='submit' style={{ width: '100%' }}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ParamsInput;
