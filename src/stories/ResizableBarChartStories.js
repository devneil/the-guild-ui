import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import ResizableBarChart from '../ResizableBarChart';


storiesOf("ResizableBarChart")
  .add("empty", () => (
    <ResizableBarChart
      buckets={[]}
      ancestors={''}
      onClick={action("clicked")}
      mouseDown={(ancestors, bucket) => action("mouseDown: ancestors: " + ancestors + " bucket: " + JSON.stringify(bucket))}
      resizeBucket={(delta, bucket, chartHeight) => action("resizeBucket: " + delta + " bucket: " + JSON.stringify(bucket) + " chartHeight: " + chartHeight)}
      checkAlternate={(bucket) => false}
      newBucketReq={action("newBucketReq")}
      bucketOptions={ [] }
    />
  ))