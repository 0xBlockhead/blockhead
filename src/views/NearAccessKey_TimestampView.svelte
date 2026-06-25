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
		'$accessKey',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$accessKey',
				'timestampMs',
				'source',
				{
					label: 'block height/hash',
				},
				'nonce',
			],
			[
				'permission',
				{
					label: 'allowance',
				},
				'receiverId',
				{
					label: 'method count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Access key',
				items: [
					{
						label: 'parent NEAR access key',
					},
				],
			},
			{
				label: 'Function-call scope',
				items: [
					'receiverId',
					'methodNames',
					{
						label: 'allowance',
					},
				],
			},
			{
				label: 'Block',
				items: [
					{
						label: 'NEAR block when block hash/height resolves',
					},
				],
			},
			{
				label: 'Source',
				items: [
					{
						label: 'view_access_key/access_key_changes payload',
					},
					{
						label: 'freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.NearAccessKey_Timestamp>
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
	entityType={EntityType.NearAccessKey_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
