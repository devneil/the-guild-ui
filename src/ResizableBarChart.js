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

    }    
  }

  renderLines() {
    return Array(10).fill(null).map((el,i) => (
      <HLine 
        top={i*10}
        key={i}
      />
    ))
  }

  renderBuckets(buckets, parentId, mouseDown, resizeBucket, checkAlternate) {

    let bucketCount = buckets.length;

    return buckets.map((bucket) => {
      const percent = (bucket.amount) * 100;
      const bucketWidth = (100 / bucketCount) / 2;
      const hasChildren = ((bucket.children) && (bucket.children.length > 0));
      const isAlternate = checkAlternate(bucket);
      return (
        <Bucket
          percent={percent}
          width={bucketWidth}
          key={bucket.name}        
          parentId={parentId}  
          mouseDown={ () => mouseDown(parentId, bucket)}
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

          { this.renderBuckets(
              this.props.buckets, 
              this.props.ancestors, 
              this.props.mouseDown, 
              this.props.resizeBucket,
              this.props.checkAlternate
              ) }
              <Button onClick={() => {this.props.newBucketReq()}} style={{position : 'absolute', left: '95%'}}>+</Button>
        </div>
        <BucketTextContent 
          buckets = {this.props.buckets} 
          bucketOptions = {this.props.bucketOptions}

        />
      </div>
    )
  }
}