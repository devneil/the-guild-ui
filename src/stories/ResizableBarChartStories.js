import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import ResizableBarChart from '../ResizableBarChart';


storiesOf("ResizableBarChart")
  .add("empty", () => (
    <ResizableBarChart
      data={[]}
      mouseDown={action("mouseDown")}
      resizeBucket={action("resizeBucket")}
      checkAlternate={(bucket) => false}
      bucketOptions={ [] }
    />
  ))
  .add("three buckets", () => (
    <ResizableBarChart
      data={[{name: 'bucket 1', amount: '.5'},{name: 'bucket 2', amount: '.10'},{name: 'bucket 3', amount: '.2'}]}
      mouseDown={action("mouseDown")}
      resizeBucket={action("resizeBucket")}
      checkAlternate={(bucket) => false}
      bucketOptions={ [] }
    />
  ))
  .add("alternate bucket", () => (
    <ResizableBarChart
      data={[{name: 'bucket 1', amount: '.5'},{name: 'bucket 2', amount: '.10'},{name: 'bucket 3', amount: '.2'}]}
      mouseDown={action("mouseDown")}
      resizeBucket={action("resizeBucket")}
      checkAlternate={(bucket) => bucket.name === 'bucket 1'}
      bucketOptions={ [] }
    />
  ))