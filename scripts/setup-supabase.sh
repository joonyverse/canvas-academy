#!/bin/bash

# Supabase CLI setup script
echo "🔧 Setting up Supabase CLI..."

# Check if token is provided
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "❌ SUPABASE_ACCESS_TOKEN environment variable not set"
    echo "💡 Please set it with: export SUPABASE_ACCESS_TOKEN='your_token_here'"
    echo "💡 Or add it to your .env.local file"
    exit 1
fi

echo "🔗 Logging in to Supabase..."
supabase login --token "$SUPABASE_ACCESS_TOKEN"

echo "🔗 Linking to project..."
supabase link --project-ref fyrqdguugnyidktzjtku

echo "📤 Pushing database changes..."
supabase db push

echo "✅ Setup complete!"
echo "💡 Verify with: node scripts/check-schema.js"