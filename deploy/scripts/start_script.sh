#!/bin/sh

# Start the helper process
adonis key:generate
adonis migration:run --force

# Start the primary process
adonis serve