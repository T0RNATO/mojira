<script setup>
import "./style.css";

const router = useRouter();

const darkMode = window ? window.matchMedia("(prefers-color-scheme: dark)").matches: false;
</script>

<template>
    <nav class="w-full bg-c2 p-4 flex justify-between">
        <div class="h-full flex items-center gap-x-2 cursor-pointer" @click="router.push('/')">
            <ClientOnly>
                <img :src="darkMode ? '/dark.ico' : '/light.ico'" alt="Logo" class="inline-block w-12">
            </ClientOnly>
            <h1 class="inline-block">Mojira Bug Viewer</h1>
        </div>
        <div class="my-auto flex items-center">
            <a href="https://github.com/T0RNATO/mojira" target="_blank">
                <img src="/ghlogo.webp" alt="GitHub Logo" class="w-6 dark:invert opacity-50 hover:opacity-80 transition-opacity">
            </a>
        </div>
    </nav>
    <div class="p-4">
        <NuxtPage/>
    </div>
</template>
