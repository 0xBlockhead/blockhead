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
		'$resource',
		'timestampMs',
		'gatewayOrigin',
	],
	content: {
		dl: [
			[
				'$resource',
				'timestampMs',
				'source',
				'gatewayOrigin',
				'gatewayUrl',
				'reachable',
			],
			[
				'contentType',
				'contentLength',
				'fileName',
				'extension',
				'displayType',
				{
					label: 'inferred-content-type status',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Resource',
				items: [
					{
						label: 'parent transaction/path identity',
					},
				],
			},
			{
				label: 'Preview',
				items: [
					{
						label: 'text/media/binary content based on displayType',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'gateway headers',
					},
					{
						label: 'content-type inference',
					},
					{
						label: 'payload availability',
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
			selection: EntityProxyResource<typeof schema, EntityType.ArweaveResource_Timestamp>
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
	entityType={EntityType.ArweaveResource_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
