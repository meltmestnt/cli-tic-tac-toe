import figures from 'figures';
import { Box, Text, TextProps } from 'ink'
import React from 'react'

export type QuestionProps = TextProps;

const Question = ({ children, ...rest }: QuestionProps) => {
  return (
    <Box alignItems='center' justifyContent='flex-start'>
      <Text color="green">{figures.questionMarkPrefix}&nbsp;</Text>
      <Text color="whiteBright" bold {...rest}>{children}</Text>
    </Box>
  )
}

export default Question