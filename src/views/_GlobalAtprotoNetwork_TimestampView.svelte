<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	closed: [
		'$hub',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$hub',
				'timestampMs',
				'source',
			],
			[
				'sourceWindowActorCount',
				'sourceWindowPostCount',
				'sourceWindowRepoCommitCount',
				'localCatalogActorCount',
				'localCatalogPostCount',
			],
			[
				'firehoseCursor',
				'repoRev',
				'pdsHost',
				'relayHost',
				'reachable',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Hub',
				items: [
					'$hub',
				],
			},
			{
				label: 'Observation fields',
				items: [
					'sourceWindowActorCount',
					'sourceWindowPostCount',
					'sourceWindowRepoCommitCount',
					'localCatalogActorCount',
					'localCatalogPostCount',
					'firehoseCursor',
					'repoRev',
					'pdsHost',
					'relayHost',
					'reachable',
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'SourceBinding.Atproto_BskySocial_Xrpc',
					},
					{
						label: 'SourceBinding.Atproto_Xrpc',
					},
					{
						label: 'SourceBinding.AtprotoSync_Xrpc',
					},
					{
						label: 'SourceBinding.Constants_Internal',
					},
				],
			},
		],
	},
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType._GlobalAtprotoNetwork_Timestamp>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType._GlobalAtprotoNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
