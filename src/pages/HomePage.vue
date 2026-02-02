<template>
    <div class="flex flex-col w-full h-full text-xl">
        <section class="flex justify-center items-end gap-4 p-4">
            <div class="flex items-center gap-x-4 grow">
                <label for="title" class="text-red-700 font-bold">抽獎主題</label>
                <input v-model="title" id="title" type="text" class="border border-gray-300 rounded-md p-2 grow"
                    placeholder="請輸入抽獎主題" />
            </div>
        </section>
        <section class="flex w-full p-4 gap-4">
            <div class="flex flex-col gap-2 grow">
                <label for="prizes" class="text-red-700 font-bold">獎項內容</label>
                <textarea v-model="prizes" id="prizes" rows="10"
                    class="border border-gray-300 rounded-md p-2 resize-none" placeholder="請輸入獎項內容，每行一個獎項"></textarea>
            </div>
            <div class="flex flex-col gap-2 grow">
                <label for="participants" class="text-red-700 font-bold">抽獎者名單</label>
                <textarea v-model="participants" id="participants" rows="10"
                    class="border border-gray-300 rounded-md p-2 resize-none" placeholder="請輸入抽獎名單，每行一個人名"></textarea>
            </div>
        </section>
        <div class="flex justify-center">
            <button class="bg-red-600 hover:bg-red-700 cursor-pointer text-white font-bold py-2 px-4 rounded-full w-45"
                @click="start">開始抽獎</button>
        </div>
        <section class="p-4">
            <div id="resultBlock" class="flex flex-col gap-2 grow">
                <label for="result" class="text-red-700 font-bold">中獎結果</label>
                <div class="border border-gray-300 rounded-md p-2 min-h-[100px]">
                    <div v-for="result in results" :key="result.prize">
                        <span class="text-red-700">🎁{{ result.prize }}</span> - 😆{{ result.winner }}
                    </div>
                </div>
            </div>
        </section>
    </div>
    <div v-show="errorMessage.length" class="fixed w-dvw h-dvh" @click="errorMessage = ''">
        <div class="flex items-center justify-center relative h-full w-full">
            <dialog class="rounded shadow flex items-center justify-center relative">
                <div class="bg-white p-6 rounded-lg flex flex-col items-center justify-center">
                    <p>{{ errorMessage }}</p>
                    <button @click="errorMessage = ''"
                        class="mt-4 bg-red-600 text-white px-4 py-2 rounded cursor-pointer">關閉</button>
                </div>
            </dialog>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const title = ref('');
const prizes = ref('');
const participants = ref('');
const results = ref();
const errorMessage = ref('');

const start = () => {
    const prizeList = prizes.value.split('\n').map(p => p.trim()).filter(p => p.length > 0);
    const participantList = participants.value.split('\n').map(p => p.trim()).filter(p => p.length > 0);
    if (prizeList.length === 0) {
        errorMessage.value = "請輸入至少一個獎項。";
        return;
    }
    if (participantList.length === 0) {
        errorMessage.value = "請輸入至少一個抽獎者。";
        return;
    }
    if (participantList.length < prizeList.length) {
        errorMessage.value = "抽獎者人數不足以抽出所有獎項，請增加抽獎者人數或減少獎項數量。";
        return;
    }
    results.value = [];
    randomPermutationK(participantList, prizeList.length).forEach((p, i) => {
        results.value.push({
            prize: prizeList[i], winner: p
        })
    });
    if (results.value.length === 0) {

    }
    scrollTo(0, document.body.scrollHeight);

}

// 產生 [0, n) 的均勻隨機整數（避免 modulo bias）
// 優先用 crypto.getRandomValues；沒有 crypto 就退回 Math.random（較不理想）
function randInt(n: number): number {
    if (n <= 0 || !Number.isInteger(n)) throw new Error("n must be a positive integer");

    // Browser / modern runtimes
    const cryptoObj: Crypto | undefined = (globalThis as any).crypto;
    if (cryptoObj?.getRandomValues) {
        // rejection sampling to avoid modulo bias
        const maxUint32 = 0xFFFF_FFFF; // 2^32 - 1
        const limit = maxUint32 - (maxUint32 % n);
        const buf = new Uint32Array(1);

        while (true) {
            cryptoObj.getRandomValues(buf);
            const x = buf[0];
            if (x && x < limit) return x % n;
        }
    }

    // Fallback: not cryptographically strong
    return Math.floor(Math.random() * n);
}

//  從 n 個元素中，隨機抽出一組「有順序、不可重複」的 k 個索引（k-permutation）
//  回傳 idx 長度為 k，內容都在 [0, n) 且不重複，順序代表排列
function randomPermutationIndexK(n: number, k: number): number[] {
    if (Number.isNaN(n) || Number.isNaN(k)) throw new Error("n and k must be numbers");
    if (k < 0 || k > n) throw new Error("k must be in [0, n]");

    // 只做一次就停：直接生成一組即可
    const a = Array.from({ length: n }, (_, i) => i);
    // partial Fisher-Yates: 只洗前 k 個位置
    for (let i = 0; i < k; i++) {
        const j = i + randInt(n - i); // j in [i, n)
        const tmp = a[i];
        if (a[i] && a[j]) a[i] = a[j];
        if (a[j] && tmp) a[j] = tmp;
    }
    return a.slice(0, k);
}

/** 如果你有 people array，直接回傳人選（含順序） */
function randomPermutationK<T>(items: readonly T[], k: number): T[] {
    const idx = randomPermutationIndexK(items.length, k);
    return idx.map(i => items[i]).filter((item): item is T => item !== undefined);
}

</script>
<style scoped lang="scss"></style>