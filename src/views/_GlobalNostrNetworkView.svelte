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
			'scope',
			'$$timestamps',
			'$$sourceWindowProfiles',
		],
		content: {
			dl: [
				[
					'scope',
					'$$timestamps',
				],
				[
					'$$sourceWindowProfiles',
					'$$sourceWindowNotes',
					'$$sourceWindowRelays',
					'$$sourceWindowReposts',
					'$$sourceWindowArticles',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Source-window rows',
					items: [
						'$$sourceWindowProfiles',
						'$$sourceWindowNotes',
						'$$sourceWindowRelays',
						'$$sourceWindowReposts',
						'$$sourceWindowArticles',
					],
				},
				{
					label: 'Hub observations',
					items: [
						'$$timestamps',
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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalNostrNetwork>
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
	entityType={EntityType._GlobalNostrNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
