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
				label: 'account id',
			},
			{
				label: 'latest code hash',
			},
			{
				label: 'latest code size',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'account id',
					},
					{
						label: 'latest code hash',
					},
					{
						label: 'latest code size',
					},
				],
				[
					{
						label: 'storage-entry count',
					},
					{
						label: 'latest observation time',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Code observations',
					items: [
						{
							label: 'timestamped contract-code observations',
						},
					],
				},
				{
					label: 'Storage entries',
					items: [
						{
							label: 'storage entries by prefix/source',
						},
					],
				},
				{
					label: 'Account',
					items: [
						{
							label: 'parent NEAR account',
						},
					],
				},
				{
					label: 'Deployments',
					items: [
						{
							label: 'deploy-contract action rows when indexed',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'view_account code_hash today',
						},
						{
							label: 'view_code/contract_code_changes when wired',
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
			selection: EntityProxyResource<typeof schema, EntityType.NearContract>
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
	entityType={EntityType.NearContract}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
