import type {
	AnyEntityFieldResolver,
	ScopedEntityFieldResolver,
} from '$/resolvers/$EntityFieldResolver.ts'
import type { AnyEntityResolver } from '$/resolvers/$EntityResolver.ts'
import type { Source } from '$/sources/$Sources.ts'

type ResolverModule = {
	source: Source
	entityFieldResolvers: readonly AnyEntityFieldResolver[]
	entityResolvers?: readonly AnyEntityResolver[]
}

export const resolverModules = [
	(await import('$/resolvers/EthereumEips-Rest.ts')).default,
	(await import('$/resolvers/Caips-Rest.ts')).default,
	(await import('$/resolvers/Ensips-Rest.ts')).default,
	(await import('$/resolvers/Chainlist-Rest.ts')).default,
	(await import('$/resolvers/Explorer.ts')).default,
	(await import('$/resolvers/Openchain-Rest.ts')).default,
	(await import('$/resolvers/Voltaire.ts')).default,
] as unknown as readonly ResolverModule[]

export const entityFieldResolvers = (
	resolverModules.flatMap(({ source, entityFieldResolvers: list }) => (
		list.map((resolver) => ({
			...resolver,
			source,
		}))
	)) as ScopedEntityFieldResolver[]
)

type ScopedEntityResolver = AnyEntityResolver & { source: Source }

export const entityResolvers = (
	resolverModules.flatMap(({ source, entityResolvers: list }) => (
		(list ?? []).map((resolver) => ({
			...resolver,
			source,
		}))
	)) as ScopedEntityResolver[]
)
