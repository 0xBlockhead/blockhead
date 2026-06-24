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
			label: 'contract',
		},
		{
			label: 'observation time',
		},
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'contract',
				},
				{
					label: 'observation time',
				},
				'source',
				{
					label: 'linked account id',
				},
				{
					label: 'runtime bytecode hash',
				},
				{
					label: 'deleted flag',
				},
				{
					label: 'file id',
				},
				'memo',
				{
					label: 'obtainer id',
				},
				{
					label: 'expiration timestamp',
				},
				{
					label: 'auto-renew period',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Contract',
				items: [
					{
						label: 'parent Hedera contract',
					},
				],
			},
			{
				label: 'Account',
				items: [
					{
						label: 'linked Hedera account when available',
					},
				],
			},
			{
				label: 'Storage slots',
				items: [
					{
						label: 'storage-slot observations near the same observation',
					},
				],
			},
			{
				label: 'Verification metadata',
				items: [
					{
						label: 'verified source/ABI payloads when matched',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'raw contract info payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaContract_Timestamp>
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
	entityType={EntityType.HederaContract_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
