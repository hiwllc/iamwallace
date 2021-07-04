import { Meta, Story } from '@storybook/react'
import { Layout, Props } from './index'

export default {
  title: 'Components/Layout',
  component: Layout,
} as Meta

export const Base: Story<Props> = args => (
  <Layout {...args}>
    <span>{args.children}</span>
  </Layout>
)

Base.args = {
  children: 'This is the layout component',
}
