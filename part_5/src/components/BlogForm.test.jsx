import { test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('form calls event handler with correct details', async () => {
  const handleBlogSubmit = vi.fn()

  render(
    <BlogForm handleBlogSubmit={handleBlogSubmit} />
  )

  const titleInput = screen.getByLabelText('title:')
  const authorInput = screen.getByLabelText('author:')
  const urlInput = screen.getByLabelText('url:')

  await userEvent.type(titleInput, 'Testing React')
  await userEvent.type(authorInput, 'Ganesh')
  await userEvent.type(urlInput, 'https://example.com')

  await userEvent.click(screen.getByText('create'))

  expect(handleBlogSubmit).toHaveBeenCalledWith({
    title: 'Testing React',
    author: 'Ganesh',
    url: 'https://example.com'
  })
})