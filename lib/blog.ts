export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  featuredImage?: string
  tags: string[]
  author?: string
  readTime?: number
}

// Sample blog posts - in a real application, this would come from a CMS or markdown files
const blogPosts: BlogPost[] = [
  {
    slug: 'building-scalable-react-native-apps',
    title: 'Building Scalable React Native Applications: Lessons from Production',
    excerpt: 'Discover key strategies for building maintainable and scalable React Native applications based on real-world production experience.',
    content: `# Building Scalable React Native Applications: Lessons from Production

Building scalable React Native applications requires careful planning, architectural decisions, and adherence to best practices. After working on numerous production apps, here are the key lessons I've learned.

## Architecture Patterns

### 1. Feature-Based Directory Structure

Instead of organizing files by type (components, screens, etc.), organize by feature:

\`\`\`
src/
  features/
    auth/
      components/
      screens/
      services/
      types/
    profile/
      components/
      screens/
      services/
      types/
\`\`\`

### 2. State Management

For complex apps, use Redux Toolkit with RTK Query for efficient state management and caching:

\`\`\`typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),
  endpoints: (builder) => ({
    // Define your endpoints here
  }),
})
\`\`\`

## Performance Optimization

### 1. Image Optimization

Use appropriate image formats and implement lazy loading:

\`\`\`typescript
import FastImage from 'react-native-fast-image'

const OptimizedImage = ({ uri, ...props }) => (
  <FastImage
    source={{ uri, priority: FastImage.priority.normal }}
    resizeMode={FastImage.resizeMode.cover}
    {...props}
  />
)
\`\`\`

### 2. List Performance

For large lists, use FlatList with proper optimization:

\`\`\`typescript
const keyExtractor = (item: Item) => item.id
const getItemLayout = (data: any, index: number) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
})

<FlatList
  data={data}
  keyExtractor={keyExtractor}
  getItemLayout={getItemLayout}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
/>
\`\`\`

## Testing Strategy

Implement a comprehensive testing strategy:

1. **Unit Tests**: Test individual functions and components
2. **Integration Tests**: Test feature workflows
3. **E2E Tests**: Test complete user journeys with Detox

## Conclusion

Building scalable React Native apps is about making the right architectural decisions early and continuously optimizing as your app grows. Focus on maintainability, performance, and developer experience.`,
    date: '2024-12-15',
    featuredImage: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop',
    tags: ['React Native', 'Mobile Development', 'Architecture', 'Performance'],
    author: 'Joel Mbaka',
    readTime: 8,
  },
  {
    slug: 'nextjs-performance-optimization',
    title: 'Next.js Performance Optimization: From Good to Great',
    excerpt: 'Learn advanced techniques to optimize your Next.js applications for maximum performance and user experience.',
    content: `# Next.js Performance Optimization: From Good to Great

Performance is crucial for user experience and SEO. Here's how to optimize your Next.js applications for maximum speed and efficiency.

## Core Web Vitals Optimization

### 1. Largest Contentful Paint (LCP)

Optimize your largest content element:

\`\`\`typescript
import Image from 'next/image'

// Prioritize above-the-fold images
<Image
  src="/hero-image.jpg"
  alt="Hero"
  width={800}
  height={600}
  priority
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
\`\`\`

### 2. First Input Delay (FID)

Reduce JavaScript execution time:

\`\`\`typescript
// Use dynamic imports for heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
})

// Code splitting at route level
const DashboardPage = dynamic(() => import('./Dashboard'))
\`\`\`

## Bundle Optimization

### 1. Analyze Bundle Size

\`\`\`bash
npm install @next/bundle-analyzer
\`\`\`

\`\`\`javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // your config
})
\`\`\`

### 2. Tree Shaking

Import only what you need:

\`\`\`typescript
// ❌ Bad - imports entire library
import * as _ from 'lodash'

// ✅ Good - imports only needed function
import { debounce } from 'lodash'
\`\`\`

## Caching Strategies

### 1. Static Generation with ISR

\`\`\`typescript
export async function getStaticProps() {
  const data = await fetchData()
  
  return {
    props: { data },
    revalidate: 60, // Revalidate every 60 seconds
  }
}
\`\`\`

### 2. API Route Caching

\`\`\`typescript
export default function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
  // Your API logic
}
\`\`\`

## Conclusion

Performance optimization is an ongoing process. Use tools like Lighthouse, Web Vitals, and Next.js analytics to continuously monitor and improve your application's performance.`,
    date: '2024-12-10',
    featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
    tags: ['Next.js', 'Performance', 'Web Development', 'Optimization'],
    author: 'Joel Mbaka',
    readTime: 6,
  },
  {
    slug: 'ai-integration-with-langchain',
    title: 'AI Integration Made Simple with LangChain and TypeScript',
    excerpt: 'A practical guide to integrating AI capabilities into your applications using LangChain, with real-world examples and best practices.',
    content: `# AI Integration Made Simple with LangChain and TypeScript

LangChain makes it easy to build AI-powered applications. Here's how to get started with practical examples.

## Getting Started

### Installation

\`\`\`bash
npm install langchain @langchain/openai
npm install -D @types/node
\`\`\`

### Basic Setup

\`\`\`typescript
import { OpenAI } from '@langchain/openai'
import { PromptTemplate } from 'langchain/prompts'
import { LLMChain } from 'langchain/chains'

const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.7,
})
\`\`\`

## Building Your First Chain

### 1. Simple Prompt Chain

\`\`\`typescript
const template = "Translate the following text to {language}: {text}"
const promptTemplate = new PromptTemplate({
  template,
  inputVariables: ["language", "text"],
})

const chain = new LLMChain({
  llm: model,
  prompt: promptTemplate,
})

const result = await chain.call({
  language: "French",
  text: "Hello, how are you?",
})
\`\`\`

### 2. Document Q&A Chain

\`\`\`typescript
import { RetrievalQAChain } from 'langchain/chains'
import { HNSWLib } from 'langchain/vectorstores/hnswlib'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'

// Create embeddings and vector store
const embeddings = new OpenAIEmbeddings()
const vectorStore = await HNSWLib.fromTexts(
  ["Document content 1", "Document content 2"],
  [{ id: 1 }, { id: 2 }],
  embeddings
)

// Create Q&A chain
const qaChain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever())

const answer = await qaChain.call({
  query: "What is mentioned in the documents?",
})
\`\`\`

## Advanced Patterns

### 1. Custom Tools

\`\`\`typescript
import { Tool } from 'langchain/tools'

class WeatherTool extends Tool {
  name = 'weather'
  description = 'Get current weather for a location'

  async _call(location: string): Promise<string> {
    // Implement weather API call
    const weather = await fetchWeather(location)
    return \`The weather in \${location} is \${weather.description}\`
  }
}
\`\`\`

### 2. Memory Integration

\`\`\`typescript
import { BufferMemory } from 'langchain/memory'
import { ConversationChain } from 'langchain/chains'

const memory = new BufferMemory()
const conversationChain = new ConversationChain({
  llm: model,
  memory,
})

// Maintains conversation context
const response1 = await conversationChain.call({ input: "Hi, I'm John" })
const response2 = await conversationChain.call({ input: "What's my name?" })
\`\`\`

## Production Considerations

### 1. Error Handling

\`\`\`typescript
try {
  const result = await chain.call(input)
  return result
} catch (error) {
  if (error instanceof OpenAIRateLimitError) {
    // Handle rate limiting
    return await retryWithBackoff(() => chain.call(input))
  }
  throw error
}
\`\`\`

### 2. Cost Optimization

\`\`\`typescript
// Use cheaper models for simple tasks
const simpleModel = new OpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0,
})

// Cache expensive operations
const cachedChain = new LLMChain({
  llm: model,
  prompt: promptTemplate,
  memory: new RedisMemory(), // Custom Redis-based memory
})
\`\`\`

## Conclusion

LangChain provides powerful abstractions for building AI applications. Start simple with basic chains and gradually add complexity as needed. Always consider costs, error handling, and user experience in production deployments.`,
    date: '2024-12-05',
    featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    tags: ['AI', 'LangChain', 'TypeScript', 'Machine Learning'],
    author: 'Joel Mbaka',
    readTime: 10,
  },
]

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  // In a real application, this would fetch from a CMS, file system, or database
  return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  // In a real application, this would fetch from a CMS, file system, or database
  const post = blogPosts.find(post => post.slug === slug)
  return post || null
}

export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  return blogPosts.filter(post => 
    post.tags.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getAllTags(): string[] {
  const allTags = blogPosts.flatMap(post => post.tags)
  return Array.from(new Set(allTags)).sort()
}
