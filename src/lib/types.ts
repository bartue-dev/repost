export type ApiErr = {
  message: string,
  status: number,
  response: {
    data: {
      message: string
    }
  }
}

export type PostsTypes = {
  title: string,
  content: string,
  id: string,
  userId: string,
  createdAt: string,
  user: {
    name: string
  },
  reactions: {
    type: string,
    id: string
  }[]
}