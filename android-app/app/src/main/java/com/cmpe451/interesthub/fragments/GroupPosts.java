package com.cmpe451.interesthub.fragments;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.cmpe451.interesthub.InterestHub;
import com.cmpe451.interesthub.R;
import com.cmpe451.interesthub.activities.GroupActivity;
import com.cmpe451.interesthub.activities.NewContent;
import com.cmpe451.interesthub.adapters.MultipleContentAdapter;
import com.cmpe451.interesthub.adapters.SingleContentAdapter;
import com.cmpe451.interesthub.models.Content;
import com.cmpe451.interesthub.models.Group;
import com.cmpe451.interesthub.models.Message;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link GroupPosts.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link GroupPosts#newInstance} factory method to
 * create an instance of this fragment.
 */
public class GroupPosts extends Fragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private long mParam2;

    private OnFragmentInteractionListener mListener;
    List<Content> contentList;
    RecyclerView contentView;
    InterestHub hub;
    public GroupPosts() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment UserRecommendations.
     */
    // TODO: Rename and change types and number of parameters
    public static GroupPosts newInstance(String param1, long param2) {
        GroupPosts fragment = new GroupPosts();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putLong(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getLong(ARG_PARAM2);
        }
        hub = ((GroupActivity)getActivity()).hub;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        ((GroupActivity)getActivity()).setTitle(mParam1);

        final View view = inflater.inflate(R.layout.fragment_group_posts, container, false);
        FloatingActionButton fab =view.findViewById(R.id.fab_new_post);

      checkGroupforFab(fab);

        hub.getApiService().getGroupContents(mParam2).enqueue(new Callback<List<Content>>() {
            @Override
            public void onResponse(Call<List<Content>> call, Response<List<Content>> response) {
                contentList = new ArrayList<Content>();
                Log.d("SUCCSEFUL","calling group coıntents");
                if(response.body()==null) return;
                for(Content c : response.body()){
                    c.setGroupName(mParam1);
                    contentList.add(c);
                    if(c.getComponents()==null || c.getComponents().size()==0)
                        Log.d("null","null component");

                }
                setPost(view);

            }

            @Override
            public void onFailure(Call<List<Content>> call, Throwable t) {
                Log.d("FAIL","failuer when calilng group contents");
            }
        });


        return view;
    }

    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
    }

    public void setPost(View view){
        contentList.sort(new Comparator<Content>() {
            @Override
            public int compare(Content o1, Content o2) {
                if(o1.getCreatedDate().equals(o2.getCreatedDate()))
                    return 0;
                else{
                    return o2.getCreatedDate().compareTo(o1.getCreatedDate());
                }
            }
        });
        final LinearLayoutManager ll = new LinearLayoutManager(getActivity());
        ll.setOrientation(LinearLayoutManager.VERTICAL);

        MultipleContentAdapter adapter = new MultipleContentAdapter(getContext(),contentList,hub);
        contentView = (RecyclerView) view.findViewById(R.id.spesific_group_recycler_view);
        contentView.setLayoutManager(ll);

        contentView.setAdapter(adapter);
    }

    public interface OnFragmentInteractionListener {
        // TODO: Update argument type and name
        void onFragmentInteraction(Uri uri);
    }
    public void checkGroupforFab(FloatingActionButton fab){
        if(hub.getSessionController().isGroupsSet()) {
            for (Group g : hub.getSessionController().getGroups()) {
                if (mParam2 == g.getId()) {

                    fab.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View view) {
                            Intent intent = new Intent(getContext(), NewContent.class);
                            intent.putExtra("groupName", mParam1);
                            intent.putExtra("groupId", mParam2);
                            startActivity(intent);
                        }
                    });
                    return;
                }
            }
            fab.setVisibility(View.GONE);

        }
    }
}
