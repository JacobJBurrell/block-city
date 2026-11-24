# The loading splash is ui's #uiBoot card (see ui/mod.py); real/mod.js still looks for an old #rlBoot element and simply finds none.
# The GLTF/DRACO loaders and SkeletonUtils are no longer blocking <script> tags: real/mod.js loads them async (rlBoot()).
