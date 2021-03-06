import { FastifyInstance } from 'fastify'
import { Type } from '@sinclair/typebox'

import { response } from 'network/response'
import {
  userDto,
  idSchema,
  IdSchema,
  storeUserDto,
  StoreUserDTO
} from 'schemas'
import { UserService } from 'services'

const User = (app: FastifyInstance, prefix = '/api'): void => {
  app
    .post<{ Body: StoreUserDTO }>(
      `${prefix}/users`,
      {
        schema: {
          body: storeUserDto,
          response: {
            200: {
              error: {
                type: 'boolean'
              },
              message: userDto
            }
          },
          tags: ['user']
        }
      },
      async (request, reply) => {
        const {
          body: {
            args: { lastName, name }
          }
        } = request
        const us = new UserService({
          user: { lastName, name }
        })
        const user = await us.process({ type: 'store' })

        response({
          error: false,
          message: user,
          reply,
          status: 201
        })
      }
    )
    .get(
      `${prefix}/users`,
      {
        schema: {
          response: {
            200: {
              error: {
                type: 'boolean'
              },
              message: Type.Array(userDto)
            }
          },
          tags: ['user']
        }
      },
      async (request, reply) => {
        const us = new UserService()
        const users = await us.process({ type: 'getAll' })

        response({
          error: false,
          message: users,
          reply,
          status: 200
        })
      }
    )
    .delete(
      `${prefix}/users`,
      {
        schema: {
          response: {
            200: {
              error: {
                type: 'boolean'
              },
              message: {
                type: 'string'
              }
            }
          },
          tags: ['user']
        }
      },
      async (request, reply) => {
        const us = new UserService()
        const result = await us.process({ type: 'deleteAll' })

        response({
          error: false,
          message: result,
          reply,
          status: 200
        })
      }
    )
    .get<{ Params: IdSchema }>(
      `${prefix}/user/:id`,
      {
        schema: {
          params: idSchema,
          response: {
            200: {
              error: {
                type: 'boolean'
              },
              message: userDto
            }
          },
          tags: ['user']
        }
      },
      async (request, reply) => {
        const {
          params: { id }
        } = request
        const us = new UserService({ id })
        const user = await us.process({ type: 'getOne' })

        response({
          error: false,
          message: user,
          reply,
          status: 200
        })
      }
    )
    .patch<{ Body: StoreUserDTO; Params: IdSchema }>(
      `${prefix}/user/:id`,
      {
        schema: {
          body: storeUserDto,
          params: idSchema,
          response: {
            200: {
              error: {
                type: 'boolean'
              },
              message: userDto
            }
          },
          tags: ['user']
        }
      },
      async (request, reply) => {
        const {
          body: {
            args: { name, lastName }
          },
          params: { id }
        } = request
        const us = new UserService({
          userWithId: { name, lastName, id }
        })
        const user = await us.process({ type: 'update' })

        response({
          error: false,
          message: user,
          reply,
          status: 200
        })
      }
    )
    .delete<{ Params: IdSchema }>(
      `${prefix}/user/:id`,
      {
        schema: {
          params: idSchema,
          response: {
            200: {
              error: {
                type: 'boolean'
              },
              message: {
                type: 'string'
              }
            }
          },
          tags: ['user']
        }
      },
      async (request, reply) => {
        const {
          params: { id }
        } = request
        const us = new UserService({ id })
        const result = await us.process({ type: 'delete' })

        response({
          error: false,
          message: result,
          reply,
          status: 200
        })
      }
    )
}

export { User }
