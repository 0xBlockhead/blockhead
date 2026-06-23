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
					'feedVariant',
					'fid',
					'channelId',
					'viewerFid',
					'sourceWindowCastCount',
					'sourceWindowUserCount',
					'sourceWindowChannelCount',
					'localCatalogFeedVariantCount',
					'localCatalogChannelCount',
					'hubHost',
					'snapchainHost',
					'reachable',
					'cursor',
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
						'feedVariant',
						'fid',
						'channelId',
						'viewerFid',
						'sourceWindowCastCount',
						'sourceWindowUserCount',
						'sourceWindowChannelCount',
						'localCatalogFeedVariantCount',
						'localCatalogChannelCount',
						'hubHost',
						'snapchainHost',
						'reachable',
						'cursor',
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'SourceBinding.Constants_Internal',
						},
						{
							label: 'SourceBinding.Farcaster_Rest',
						},
						{
							label: 'SourceBinding.Neynar_Rest',
						},
						{
							label: 'SourceBinding.Snapchain_Rest',
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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalFarcasterNetwork_Timestamp>
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
	entityType={EntityType._GlobalFarcasterNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
