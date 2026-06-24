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
		{
			label: 'directory URL',
		},
		{
			label: 'OHTTP gateway URL',
		},
		{
			label: 'OHTTP key config presence/length',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'directory URL',
				},
				{
					label: 'OHTTP gateway URL',
				},
				{
					label: 'OHTTP key config presence/length',
				},
				{
					label: 'max payload bytes',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'OHTTP gateway',
				items: [
					{
						label: 'derived gateway URL',
					},
					{
						label: 'fetched key config bytes/base64 preview',
					},
				],
			},
			{
				label: 'Receiver endpoints',
				items: [
					{
						label: 'PayjoinEndpoint target rows when advertised by payment material or session evidence',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'OHTTP key-config HTTP response',
					},
					{
						label: 'freshness',
					},
					{
						label: 'errors',
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
			selection: EntityProxyResource<typeof schema, EntityType.PayjoinDirectory>
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
	entityType={EntityType.PayjoinDirectory}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
