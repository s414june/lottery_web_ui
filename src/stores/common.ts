import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCommonStore = defineStore('common', () => {
    const displayName = ref<string>('🐸 FrogDrop Player')
    const deviceHint = ref<string>('Unknown')
    const code = ref<string>('')
    const files = ref<File[]>([])

    return {
        displayName,
        deviceHint,
        files,
        code,
    }
}, {
    persist: [
        {
            pick: ['displayName', 'deviceHint'],
            storage: localStorage,
        },
        {
            pick: ['files']
        }
    ]
})
