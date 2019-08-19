import React from 'react';
import { Rnd } from 'react-rnd';
import DropdownItem from 'react-bootstrap/DropdownItem';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import './ResizableBarChart.css';

const HLine = ({top}) => {
  return (
    <div className='rbc-h-line' style={{ top: `${top}%` }} />
  )
};

const BucketTextContent = ({ buckets, bucketOptions, addBucket }) => {
  let width = (100 / buckets.length);
  return (
    <div className='rbc-bucket-text-content'>
    {
      buckets.map((bucket) => (
      <div className='rbc-bucket-text' key={bucket.name} style={{width: `${width}%`}}>
        <DropdownButton title={bucket.name}>
          {bucketOptions.reduce((a, opt, index) => {
            if (opt.checkShouldShow(bucket))
              a.push(<DropdownItem key={index} onSelect={() => {opt.callback(bucket)}}>{opt.text}</DropdownItem>);                
            return a;
          }, [])}
        </DropdownButton>
      </div>
      ))
    }

    </div>
  )
};

const Bucket = ({percent, width, hasChildren, isAlternate, mouseDown, resizeBucket}) => {
  return (
    <Rnd 
      className= { isAlternate ? 'rbc-bucket-alt' : 'rbc-bucket' } 
      default={{ height: `${percent}%`, width: `${width}%` }} 
      disableDragging= {true}
      enableResizing= {{ top:true }}
      style={{ position: 'relative'}}
      onMouseDown = {(e) => { mouseDown() }}
      onResizeStop={(e, direction, refToElement, delta, position) => {
        resizeBucket(delta)
      }}      
    >
      <div className='rbc-bucket-handle'/>
      { hasChildren && <div style={{ textAlign:'center' }} >...</div> }
    </Rnd>
  )
}

export default class ResizableBarChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      addingBucket : false,
      newBucketName : '',
      buckets : this.props.data 
    }    

    this.handleBucketNameChange = this.handleBucketNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleBucketNameChange(event) {
    this.setState({newBucketName: event.target.value});
  }

  handleSubmit(addMe) {
    if (addMe)    
      this.addBucket(this.state.newBucketName);
    this.setState(() => ({addingBucket: false}))
  }

  addBucketReq(){
    this.setState(() => ({addingBucket: true}))
  }

  addBucket(bucketName){
    let newBucket = {      
      amount: 0
    }
    newBucket.name = bucketName;
    let buckets = this.state.buckets;   

    buckets.push(newBucket);
    
    this.setState(() => ({buckets: buckets}));
  }

  renderLines() {
    return Array(10).fill(null).map((el,i) => (
      <HLine 
        top={i*10}
        key={i}
      />
    ))
  }

  renderBuckets(buckets, mouseDown, resizeBucket, checkAlternate) {

    let bucketCount = buckets.length;

    return buckets.map((bucket, index) => {
      const percent = (bucket.amount) * 100;
      const bucketWidth = (100 / bucketCount) / 2;
      const hasChildren = ((bucket.children) && (bucket.children.length > 0));
      const isAlternate = checkAlternate(bucket);
      return (
        <Bucket
          percent={percent}
          width={bucketWidth}
          key={index}        
          mouseDown={ () => mouseDown(bucket)}
          hasChildren={hasChildren}
          isAlternate={isAlternate}
          resizeBucket={ (delta) => resizeBucket(delta, bucket, this.chartElement.clientHeight) }
        />
      )
    });
  }

  render() {
    return (
      <div className='rbc' >  
        <div className='rbc-container' ref={ (chartElement) => this.chartElement = chartElement}>
          { this.renderLines() }

          { this.state.buckets && this.renderBuckets(
              this.state.buckets, 
              this.props.mouseDown, 
              this.props.resizeBucket,
              this.props.checkAlternate
              ) }
          { !this.state.addingBucket &&
            <Button onClick={() => {this.addBucketReq()}} style={{position : 'absolute', left: '95%'}}>+</Button>}
          {this.state.addingBucket && <div className='rbc-form'>
            <label>New Name:<input type='text' className='rbc-in' value={this.state.newBucketName} onChange={this.handleBucketNameChange}></input></label>
            <Button onClick={() => this.handleSubmit(true)}>Save</Button>
            <Button onClick={() => this.handleSubmit(false)}>Cancel</Button>            
          </div>}
        </div>
        {this.state.buckets && <BucketTextContent 
          buckets = {this.state.buckets} 
          bucketOptions = {this.props.bucketOptions}
        /> }
      </div>
    )
  }
}