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
				'configuredRelayCount',
				'reachableRelayCount',
				'sourceWindowProfileCount',
				'sourceWindowNoteCount',
				'sourceWindowRelayCount',
				'sourceWindowRepostCount',
				'sourceWindowArticleCount',
				'localCatalogRelayCount',
				'reachable',
				'filterKind',
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
					'configuredRelayCount',
					'reachableRelayCount',
					'sourceWindowProfileCount',
					'sourceWindowNoteCount',
					'sourceWindowRelayCount',
					'sourceWindowRepostCount',
					'sourceWindowArticleCount',
					'localCatalogRelayCount',
					'reachable',
					'filterKind',
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'SourceBinding.Constants_Internal',
					},
					{
						label: 'SourceBinding.NostrBand_Rest',
					},
					{
						label: 'SourceBinding.NostrRelay_Nip11_Http',
					},
					{
						label: 'SourceBinding.NostrRelay_WebSocket',
					},
					{
						label: 'SourceBinding.Primal_Rest',
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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalNostrNetwork_Timestamp>
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
	entityType={EntityType._GlobalNostrNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
