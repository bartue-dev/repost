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
  tags: string[],
  reactions: {
    type: string,
    id: string
  }[],
  likedPost: {
    userId: string
  }[],
  comment: {
    id: string,
    comment: string,
    createdAt: string,
    userId: string,
    user: {
      name: string
    }
    childComment: {
      id: string,
      comment: string,
      createdAt: string,
      userId: string,
      parentCommentId: string
    }[]
  }[]
}

export type PostsPropsTypes = {
  posts: PostsTypes[] | undefined,
  searchPost: string[],
  isLoading: boolean,
  isError: boolean,
  errorMessage: string | null | undefined,
}