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
			'protocolName',
			'topology',
		],
		content: {
			dl: [
				[
					'scope',
					'protocolName',
					'homeUrl',
					'docsUrl',
					'registryLabel',
					'topology',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Protocol profile',
					items: [
						'scope',
						'protocolName',
						'homeUrl',
						'docsUrl',
						'registryLabel',
						'topology',
					],
				},
				{
					label: 'Global coverage',
					items: [
						{
							label: '_GlobalLensNetwork',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
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
			selection: EntityProxyResource<typeof schema, EntityType.LensNetwork>
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
	entityType={EntityType.LensNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
